import type { NextPage, GetServerSideProps } from 'next';
import { Trans } from 'react-i18next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../next-i18next.config';

const Home: NextPage = function Home() {
  const { t } = useTranslation('index');

  return (
    <main>
      <p>
        <Trans
          t={t}
          i18nKey={'default.language.is'}
          values={{ language: '123' }}
          components={{ 1: <strong /> }}
        />
      </p>
      <p>{t('greetings')}</p>
    </main>
  );
};

export const getStaticProps: GetServerSideProps =
  async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(
          locale || i18nConfig.i18n.defaultLocale,
          ['index']
        )),
      },
    };
  };

export default Home;
