import type { NextPage, GetServerSideProps } from 'next';
import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getInitialLocale } from '@/lib/i18n';

const Home: NextPage = function Home() {
  const { t, i18n } = useTranslation();

  return (
    <main>
      <section className="m-5 p-5 border-2 rounded-xl">
        <p className="text-xl font-bold">
          <Trans
            ns="index"
            i18nKey="default.language.is"
            values={{ language: `"${i18n.language}"` }}
            components={{ 1: <strong /> }}
          />
        </p>
        <p>{t('greetings', { ns: 'index' })}</p>
      </section>
    </main>
  );
};

export const getStaticProps: GetServerSideProps =
  async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
      },
    };
  };

export default Home;
