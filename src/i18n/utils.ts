import { defaultLang, ui, type Lang, type UIKey } from './ui';

/** Resolve lang from an Astro URL (first path segment). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  return seg === 'zh' ? 'zh' : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Prefix a root-relative path with the locale when needed. */
export function localePath(lang: Lang, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return lang === defaultLang ? `/${clean}` : `/${lang}/${clean}`.replace(/\/$/, '') || `/${lang}`;
}

/** The equivalent route of `url` in the other language. */
export function alternateUrl(url: URL, target: Lang): string {
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] === 'zh') parts.shift();
  const rest = parts.join('/');
  return localePath(target, rest);
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'long' : 'short',
    day: 'numeric',
  });
}

/** CJK-aware reading time in whole minutes (min 1). */
export function readingTime(body: string): number {
  const cjk = (body.match(/[一-鿿぀-ヿ가-힯]/g) ?? []).length;
  const words = body
    .replace(/[一-鿿぀-ヿ가-힯]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}
