/**
 * newsletter-subscriber controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::newsletter-subscriber.newsletter-subscriber',
  ({ strapi }) => ({
    async create(ctx) {
      const { email, name } = ctx.request.body?.data ?? ctx.request.body ?? {};

      if (!email || typeof email !== 'string') {
        return ctx.badRequest('A valid email address is required.');
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await strapi.db
        .query('api::newsletter-subscriber.newsletter-subscriber')
        .findOne({ where: { email: normalizedEmail } });

      if (existing) {
        if (existing.active) {
          return ctx.send({ data: existing, meta: { message: 'Already subscribed' } });
        }

        const updated = await strapi.db
          .query('api::newsletter-subscriber.newsletter-subscriber')
          .update({
            where: { id: existing.id },
            data: {
              active: true,
              subscribedAt: new Date().toISOString(),
              name: name?.trim() || null,
            },
          });
        return ctx.send({ data: updated });
      }

      const entry = await strapi.db
        .query('api::newsletter-subscriber.newsletter-subscriber')
        .create({
          data: {
            email: normalizedEmail,
            name: name?.trim() || null,
            subscribedAt: new Date().toISOString(),
            active: true,
          },
        });

      return ctx.send({ data: entry });
    },
  })
);
