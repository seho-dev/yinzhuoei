import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postSlug } from '../lib/posts';
import { site } from '../config';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: site.title,
    description: site.description.en,
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/blog/${postSlug(p)}`,
    })),
  });
}
