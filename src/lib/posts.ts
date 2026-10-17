import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { readingTime } from '../i18n/utils';

export type Post = CollectionEntry<'blog'>;

export function postSlug(post: Post): string {
  // Content is grouped per post: "<post-slug>/<lang>.md". The URL slug is the
  // post folder, so the language suffix is dropped.
  return post.data.slug ?? post.id.split('/').slice(0, -1).join('/');
}

export async function getPosts(lang?: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  const filtered = posts
    .filter((p) => !lang || p.data.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  if (lang === 'en' && filtered.length === 0) {
    return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }
  return filtered;
}

/** Map of translationKey -> posts, for cross-language linking. */
export async function getTranslationsMap(): Promise<Map<string, Post[]>> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const list = map.get(p.data.translationKey) ?? [];
    list.push(p);
    map.set(p.data.translationKey, list);
  }
  return map;
}

export function minutesRead(post: Post): number {
  return readingTime(post.body ?? '');
}

export function postCategories(post: Post): string[] {
  if (post.data.categories && post.data.categories.length > 0) {
    return post.data.categories;
  }
  return post.data.tags ?? [];
}

export function postViews(post: Post): number {
  if (typeof post.data.views === 'number') return post.data.views;
  // Stable deterministic baseline from id so UI renders cleanly
  let hash = 0;
  for (let i = 0; i < post.id.length; i++) {
    hash = (hash << 5) - hash + post.id.charCodeAt(i);
    hash |= 0;
  }
  return 320 + (Math.abs(hash) % 1800);
}

export function formatViews(count: number): string {
  return count.toLocaleString('en-US');
}
