import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import GameOfLifeContainer from '@/components/containers/GameOfLifeContainer';

const Home: NextPage = function Home() {
  return (
    <main style={{ width: '90vw', height: '90vh', margin: '5vh 5vw' }}>
      <GameOfLifeContainer unitSize={15} />
    </main>
  );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  () =>
    async ({ locale }) => ({
      props: {
        ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
      },
    })
);

export default Home;
