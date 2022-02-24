export const useTranslation = () => ({
  t: (i18nKey: string, { ns }: { ns: string }) =>
    (ns ? `${ns}.` : '') + i18nKey,
  i18n: {
    language: 'en',
  },
});

export const Trans = ({ ns, i18nKey }: { ns: string; i18nKey: string }) =>
  (ns ? `${ns}.` : '') + i18nKey;
