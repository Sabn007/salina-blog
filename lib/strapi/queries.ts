import type {
  Author,
  Category,
  Post,
  PostListItem,
  StrapiResponse,
  Tag,
} from '@/types/strapi';
import { strapiFetch } from './client';

const POST_POPULATE =
  'populate[coverImage]=true&populate[gallery]=true&populate[author][populate][0]=avatar&populate[category]=true&populate[tags]=true&populate[relatedPosts][populate][0]=coverImage&populate[relatedPosts][populate][1]=category&populate[relatedPosts][populate][2]=author&populate[seoImage]=true';

const POST_LIST_POPULATE =
  'populate[coverImage]=true&populate[author][populate][0]=avatar&populate[category]=true&populate[tags]=true';

function publishedFilter() {
  return {
    'filters[publishedAt][$notNull]': 'true',
    'sort[0]': 'publishedAt:desc',
  };
}

export async function getPosts(page = 1, pageSize = 12) {
  return strapiFetch<StrapiResponse<PostListItem[]>>(`/api/posts?${POST_LIST_POPULATE}`, {
    params: {
      ...publishedFilter(),
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    },
    next: { revalidate: 60, tags: ['posts'] },
  });
}

export async function getFeaturedPosts(limit = 4) {
  return strapiFetch<StrapiResponse<PostListItem[]>>(`/api/posts?${POST_LIST_POPULATE}`, {
    params: {
      ...publishedFilter(),
      'filters[featured][$eq]': 'true',
      'pagination[pageSize]': limit,
    },
    next: { revalidate: 60, tags: ['posts', 'featured'] },
  });
}

export async function getPostBySlug(slug: string, preview = false) {
  const params: Record<string, string> = {
    'filters[slug][$eq]': slug,
  };

  if (preview) {
    params.status = 'draft';
  } else {
    Object.assign(params, publishedFilter());
  }

  const response = await strapiFetch<StrapiResponse<Post[]>>(`/api/posts?${POST_POPULATE}`, {
    params,
    next: preview ? { revalidate: 0 } : { revalidate: 60, tags: ['posts', `post-${slug}`] },
  });

  return response.data[0] ?? null;
}

export async function getAllPostSlugs() {
  const response = await strapiFetch<StrapiResponse<{ slug: string }[]>>('/api/posts', {
    params: {
      ...publishedFilter(),
      'fields[0]': 'slug',
      'pagination[pageSize]': 100,
    },
    next: { revalidate: 3600, tags: ['posts'] },
  });

  return response.data.map((post) => post.slug);
}

export async function searchPosts(query: string, page = 1) {
  return strapiFetch<StrapiResponse<PostListItem[]>>(`/api/posts?${POST_LIST_POPULATE}`, {
    params: {
      ...publishedFilter(),
      'filters[$or][0][title][$containsi]': query,
      'filters[$or][1][excerpt][$containsi]': query,
      'filters[$or][2][content][$containsi]': query,
      'pagination[page]': page,
      'pagination[pageSize]': 12,
    },
    next: { revalidate: 30, tags: ['posts', 'search'] },
  });
}

export async function getPostsByCategory(slug: string, page = 1) {
  return strapiFetch<StrapiResponse<PostListItem[]>>(`/api/posts?${POST_LIST_POPULATE}`, {
    params: {
      ...publishedFilter(),
      'filters[category][slug][$eq]': slug,
      'pagination[page]': page,
      'pagination[pageSize]': 12,
    },
    next: { revalidate: 60, tags: ['posts', `category-${slug}`] },
  });
}

export async function getPostsByTag(slug: string, page = 1) {
  return strapiFetch<StrapiResponse<PostListItem[]>>(`/api/posts?${POST_LIST_POPULATE}`, {
    params: {
      ...publishedFilter(),
      'filters[tags][slug][$eq]': slug,
      'pagination[page]': page,
      'pagination[pageSize]': 12,
    },
    next: { revalidate: 60, tags: ['posts', `tag-${slug}`] },
  });
}

export async function getCategories() {
  return strapiFetch<StrapiResponse<Category[]>>('/api/categories', {
    params: {
      'populate[coverImage]': 'true',
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 50,
    },
    next: { revalidate: 300, tags: ['categories'] },
  });
}

export async function getCategoryBySlug(slug: string) {
  const response = await strapiFetch<StrapiResponse<Category[]>>('/api/categories', {
    params: {
      'filters[slug][$eq]': slug,
      'populate[coverImage]': 'true',
    },
    next: { revalidate: 300, tags: ['categories', `category-${slug}`] },
  });
  return response.data[0] ?? null;
}

export async function getTags() {
  return strapiFetch<StrapiResponse<Tag[]>>('/api/tags', {
    params: {
      'sort[0]': 'name:asc',
      'pagination[pageSize]': 100,
    },
    next: { revalidate: 300, tags: ['tags'] },
  });
}

export async function getTagBySlug(slug: string) {
  const response = await strapiFetch<StrapiResponse<Tag[]>>('/api/tags', {
    params: {
      'filters[slug][$eq]': slug,
    },
    next: { revalidate: 300, tags: ['tags', `tag-${slug}`] },
  });
  return response.data[0] ?? null;
}

export async function getAuthors() {
  return strapiFetch<StrapiResponse<Author[]>>('/api/authors', {
    params: {
      'populate[avatar]': 'true',
      'sort[0]': 'name:asc',
    },
    next: { revalidate: 300, tags: ['authors'] },
  });
}

export async function getAuthorBySlug(slug: string) {
  const response = await strapiFetch<StrapiResponse<Author[]>>('/api/authors', {
    params: {
      'filters[slug][$eq]': slug,
      'populate[avatar]': 'true',
    },
    next: { revalidate: 300, tags: ['authors', `author-${slug}`] },
  });
  return response.data[0] ?? null;
}

export async function subscribeNewsletter(email: string, name?: string) {
  return strapiFetch('/api/newsletter-subscribers', {
    method: 'POST',
    body: JSON.stringify({ data: { email, name } }),
    cache: 'no-store',
  });
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return strapiFetch('/api/contact-messages', {
    method: 'POST',
    body: JSON.stringify({ data }),
    cache: 'no-store',
  });
}

export async function getRecentPostsForFeed(limit = 20) {
  return strapiFetch<StrapiResponse<Post[]>>(
    `/api/posts?${POST_POPULATE}&fields[0]=title&fields[1]=slug&fields[2]=excerpt&fields[3]=content&fields[4]=publishedAt&fields[5]=createdAt`,
    {
      params: {
        ...publishedFilter(),
        'pagination[pageSize]': limit,
      },
      next: { revalidate: 3600, tags: ['posts', 'feed'] },
    }
  );
}
