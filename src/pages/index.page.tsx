import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import GameOfLifeMapContainer from '@/components/containers/GameOfLifeMapContainer';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';

const Home: NextPage = function Home() {
  const { status, joinGame, leaveGame } = useContext(GameOfLibertyContext);

  useEffect(() => {
    if (status !== 'ONLINE') {
      joinGame();
    }

    return () => {
      if (status === 'ONLINE') {
        leaveGame();
      }
    };
  }, [status]);

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <GameOfLifeMapContainer unitSize={20} />
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
