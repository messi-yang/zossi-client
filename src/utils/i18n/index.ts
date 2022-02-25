import i18nConfig from '../../../next-i18next.config';

/**
 * Help you get defaultLocale from i18nConfig
 * @param locale
 * @returns
 */
export function getInitialLocale(locale: string | null | undefined) {
  return locale || i18nConfig.i18n.defaultLocale;
}

export default {};
