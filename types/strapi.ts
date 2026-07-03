export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  bio?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  avatar?: StrapiImage | null;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: StrapiImage | null;
}

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  readingTime?: number;
  featured?: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  coverImage?: StrapiImage | null;
  gallery?: StrapiImage[];
  author?: Author | null;
  category?: Category | null;
  tags?: Tag[];
  relatedPosts?: Post[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImage?: StrapiImage | null;
  canonicalUrl?: string | null;
}

export type PostListItem = Omit<Post, 'content' | 'gallery' | 'relatedPosts'>;
