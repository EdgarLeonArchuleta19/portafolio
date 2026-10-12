import type { Core } from '@strapi/strapi';

const PUBLIC_READ_ACTIONS = [
  'api::profile.profile.find',
  'api::project.project.find',
  'api::project.project.findOne',
  'api::skill.skill.find',
  'api::skill.skill.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
];

export async function grantPublicReadAccess(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const permissions = strapi.db.query('plugin::users-permissions.permission');

  for (const action of PUBLIC_READ_ACTIONS) {
    const exists = await permissions.findOne({ where: { action, role: publicRole.id } });
    if (!exists) {
      await permissions.create({ data: { action, role: publicRole.id } });
      strapi.log.info(`[seed] Permiso público concedido: ${action}`);
    }
  }
}
