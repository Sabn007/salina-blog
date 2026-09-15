/**
 * Strapi 5 Document Service exposes `status=draft` on REST find/findOne.
 * Public find permission is not scoped by publication state, so anonymous
 * clients can otherwise read unpublished documents.
 *
 * Privileged strategies are those that authenticate a Content API token or
 * an admin — not users-permissions Public/Authenticated roles.
 *
 * @see https://github.com/strapi/strapi/issues/25326
 */

export const PRIVILEGED_AUTH_STRATEGIES = new Set([
  'content-api-token',
  'api-token',
  'admin-token',
  'admin',
]);

const DRAFT_STATUS = 'draft';
const PREVIEW_PUBLICATION_STATE = 'preview';

export type AuthLike = {
  strategy?: string | { name?: string };
};

function collectQueryValues(value: unknown): string[] {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectQueryValues);
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return [String(value)];
  }

  return [];
}

function normalizeQueryToken(value: string): string {
  return value.trim().toLowerCase();
}

export function getAuthStrategyName(auth: AuthLike | null | undefined): string | undefined {
  const strategy = auth?.strategy;

  if (typeof strategy === 'string') {
    return strategy;
  }

  if (strategy && typeof strategy.name === 'string') {
    return strategy.name;
  }

  return undefined;
}

export function canAccessDrafts(auth: AuthLike | null | undefined): boolean {
  const name = getAuthStrategyName(auth);
  return name != null && PRIVILEGED_AUTH_STRATEGIES.has(name);
}

export function queryRequestsDrafts(query: unknown): boolean {
  if (!query || typeof query !== 'object') {
    return false;
  }

  const record = query as Record<string, unknown>;

  const statuses = collectQueryValues(record.status).map(normalizeQueryToken);
  if (statuses.includes(DRAFT_STATUS)) {
    return true;
  }

  // Strapi 4 leftover; block if a compatibility layer still honours it.
  const publicationStates = collectQueryValues(record.publicationState).map(normalizeQueryToken);
  return publicationStates.includes(PREVIEW_PUBLICATION_STATE);
}
