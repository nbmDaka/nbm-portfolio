import en from './en.json';
import ru from './ru.json';

export type Locale = 'en' | 'ru';

export const locales: Locale[] = ['en', 'ru'];
export const defaultLocale: Locale = 'en';

export function useTranslations(locale: string | undefined): typeof en {
  return locale === 'ru' ? ru : en;
}

/** Prefix for locale-rooted paths, e.g. '' for en, '/ru' for ru. */
export function localePrefix(locale: string | undefined): string {
  return locale === 'ru' ? '/ru' : '';
}

/** Swap the locale prefix of the current path. */
export function localizedPath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/ru(?=\/|$)/, '') || '/';
  if (target === 'ru') return `/ru${bare === '/' ? '/' : bare}`;
  return bare;
}
