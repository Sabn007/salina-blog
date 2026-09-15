import { canAccessDrafts, queryRequestsDrafts } from '../../../utils/draft-access';

type DraftGuardContext = {
  query?: unknown;
  state?: { auth?: { strategy?: string | { name?: string } } };
  forbidden: (message?: string) => unknown;
};

/**
 * Route middleware (runs after authenticate). Public find/findOne may not
 * request draft documents via `status=draft`. API-token and admin callers
 * can still preview.
 */
export default (_config: unknown, _deps?: unknown) => {
  return async (ctx: DraftGuardContext, next: () => Promise<void>) => {
    if (queryRequestsDrafts(ctx.query) && !canAccessDrafts(ctx.state?.auth)) {
      return ctx.forbidden(
        'Draft documents are only available to authenticated admin or API-token clients.'
      );
    }

    return next();
  };
};
