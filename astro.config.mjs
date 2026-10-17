// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://yinzhuoei.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
      defaultColor: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
