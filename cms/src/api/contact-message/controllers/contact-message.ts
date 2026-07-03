/**
 * contact-message controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-message.contact-message',
  ({ strapi }) => ({
    async create(ctx) {
      const body = ctx.request.body?.data ?? ctx.request.body ?? {};
      const { name, email, subject, message } = body;

      if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        return ctx.badRequest('Name, email, subject, and message are required.');
      }

      const entry = await strapi.db.query('api::contact-message.contact-message').create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          read: false,
        },
      });

      return ctx.send({ data: entry });
    },
  })
);
