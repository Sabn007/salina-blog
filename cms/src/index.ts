import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS = {
  post: ['find', 'findOne'],
  category: ['find', 'findOne'],
  tag: ['find', 'findOne'],
  author: ['find', 'findOne'],
  'newsletter-subscriber': ['create'],
  'contact-message': ['create'],
} as const;

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  const existingPermissions = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: publicRole.id } });

  const existingActions = new Set(
    existingPermissions.map((p: { action: string }) => p.action)
  );

  for (const [controller, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
    for (const action of actions) {
      const permissionAction = `api::${controller}.${controller}.${action}`;
      if (existingActions.has(permissionAction)) continue;

      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: permissionAction,
          role: publicRole.id,
        },
      });
    }
  }
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
  },
};
