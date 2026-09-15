/**
 * post router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::post.post', {
  config: {
    find: {
      middlewares: ['api::post.reject-public-drafts'],
    },
    findOne: {
      middlewares: ['api::post.reject-public-drafts'],
    },
  },
});
