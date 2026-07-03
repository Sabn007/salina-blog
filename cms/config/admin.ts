import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('FRONTEND_URL', 'http://localhost:3000')],
      async handler(uid, { documentId, status }) {
        if (uid !== 'api::post.post' || !documentId) return null;

        const document = await strapi.documents('api::post.post').findOne({
          documentId,
          status: (status || 'draft') as 'draft' | 'published',
        });

        if (!document?.slug) return null;

        const frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        return `${frontendUrl}/blog/${document.slug}?preview=true`;
      },
    },
  },
});

export default config;
