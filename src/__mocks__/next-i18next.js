module.exports = {
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (i18nKey, { ns }) => (ns ? `${ns}.` : '') + i18nKey,
      i18n: {
        language: 'en',
      },
    };
  },
  Trans: ({ ns, i18nKey }) => <>{(ns ? `${ns}.` : '') + i18nKey}</>,
};
