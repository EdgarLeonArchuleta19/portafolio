import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { Core, UID } from '@strapi/strapi';
import { CATEGORIES, LOCALES, PROFILE, PROJECTS, SKILLS, type Locale, type SkillKey } from './content';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

type DocumentData = Record<string, unknown>;

const DEFAULT_LOCALE: Locale = 'en';

const untypedDocuments = (strapi: Core.Strapi, uid: UID.ContentType) => strapi.documents(uid) as any;

export async function isContentEmpty(strapi: Core.Strapi) {
  return (await strapi.documents('api::project.project').count({})) === 0;
}

async function publishInAllLocales(
  strapi: Core.Strapi,
  uid: UID.ContentType,
  existingDocumentId: string | undefined,
  dataFor: (locale: Locale) => DocumentData,
) {
  const documents = untypedDocuments(strapi, uid);
  let documentId = existingDocumentId;

  for (const locale of LOCALES) {
    const params = { locale, data: dataFor(locale), status: 'published' };
    const saved = documentId
      ? await documents.update({ documentId, ...params })
      : await documents.create(params);
    documentId = saved.documentId;
  }

  return documentId!;
}

async function findInDefaultLocale(strapi: Core.Strapi, uid: UID.ContentType, filters: DocumentData, populate?: string[]) {
  return untypedDocuments(strapi, uid).findFirst({ locale: DEFAULT_LOCALE, filters, populate });
}

async function createDisposableCopy(sourcePath: string) {
  const copyPath = path.join(os.tmpdir(), `portfolio-seed-${Date.now()}-${path.basename(sourcePath)}`);
  await fs.copyFile(sourcePath, copyPath);
  return copyPath;
}

async function uploadSeedAsset(strapi: Core.Strapi, fileName: string) {
  const tempFile = await createDisposableCopy(path.join(strapi.dirs.app.root, 'seed-assets', fileName));

  try {
    const { size } = await fs.stat(tempFile);
    const [file] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: {},
        files: {
          filepath: tempFile,
          originalFilename: fileName,
          mimetype: MIME_TYPES[path.extname(fileName).toLowerCase()] ?? 'application/octet-stream',
          size,
        },
      });
    return file.id as number;
  } finally {
    await fs.rm(tempFile, { force: true });
  }
}

async function seedProfile(strapi: Core.Strapi) {
  const existing = await findInDefaultLocale(strapi, 'api::profile.profile', {});
  await publishInAllLocales(strapi, 'api::profile.profile', existing?.documentId, (locale) => ({
    ...PROFILE.shared,
    ...PROFILE.localized[locale],
  }));
}

async function seedCategories(strapi: Core.Strapi) {
  const ids: Record<string, string> = {};

  for (const [index, category] of CATEGORIES.entries()) {
    const existing = await findInDefaultLocale(strapi, 'api::category.category', { name: category.name.en });
    ids[category.key] = await publishInAllLocales(strapi, 'api::category.category', existing?.documentId, (locale) => ({
      name: category.name[locale],
      order: index + 1,
    }));
  }

  return ids;
}

async function seedSkills(strapi: Core.Strapi, categoryIds: Record<string, string>) {
  const ids = {} as Record<SkillKey, string>;

  for (const skill of SKILLS) {
    const existing = await findInDefaultLocale(strapi, 'api::skill.skill', { name: skill.name });
    ids[skill.key] = await publishInAllLocales(strapi, 'api::skill.skill', existing?.documentId, () => ({
      name: skill.name,
      level: skill.level,
      category: categoryIds[skill.category],
    }));
  }

  return ids;
}

async function seedProjects(strapi: Core.Strapi, skillIds: Record<SkillKey, string>) {
  for (const project of PROJECTS) {
    const existing = await findInDefaultLocale(strapi, 'api::project.project', { slug: project.slug }, ['coverImage']);
    const coverImageId = existing?.coverImage?.id ?? (await uploadSeedAsset(strapi, project.coverAsset));

    await publishInAllLocales(strapi, 'api::project.project', existing?.documentId, (locale) => ({
      ...project.shared,
      ...project.localized[locale],
      slug: project.slug,
      published: true,
      coverImage: coverImageId,
      skills: { set: project.skills.map((key) => skillIds[key]) },
    }));
  }
}

export async function seedContent(strapi: Core.Strapi) {
  await seedProfile(strapi);
  const categoryIds = await seedCategories(strapi);
  const skillIds = await seedSkills(strapi, categoryIds);
  await seedProjects(strapi, skillIds);

  strapi.log.info(
    `[seed] Contenido cargado: perfil, ${CATEGORIES.length} categorías, ${SKILLS.length} skills, ${PROJECTS.length} proyectos.`,
  );
}
