import type { NextPage, GetStaticProps } from 'next';
import { useTranslation, Trans } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import { getInitialLocale } from '@/lib/i18n';
import { State, wrapper } from '@/stores';

const Home: NextPage = function Home() {
  const { t, i18n } = useTranslation();
  const { name } = useSelector<State, State>((state) => state);

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
        <p>{name}</p>
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      store.dispatch({
        type: 'CHANGE_NAME',
        payload: 'Shohei Ohtani',
      });
      return {
        props: {
          ...(await serverSideTranslations(getInitialLocale(locale), [
            'index',
          ])),
        },
      };
    }
);

export default Home;
