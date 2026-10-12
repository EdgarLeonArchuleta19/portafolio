import type { Core } from '@strapi/strapi';
import { isContentEmpty, seedContent } from './seed';
import { grantPublicReadAccess } from './seed/permissions';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadAccess(strapi);

    const isReseedRequested = process.env.FORCE_SEED === 'true';
    if (isReseedRequested || (await isContentEmpty(strapi))) {
      strapi.log.info(isReseedRequested ? '[seed] Recarga forzada del contenido…' : '[seed] Base vacía: cargando contenido…');
      await seedContent(strapi);
    }
  },
};
