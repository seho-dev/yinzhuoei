import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(['en', 'zh']),
    /** Shared key linking translations of the same post. */
    translationKey: z.string(),
    /** Optional URL slug override; defaults to the file name. */
    slug: z.string().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    views: z.number().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
