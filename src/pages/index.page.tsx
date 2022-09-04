import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import GameRoomContext from '@/contexts/GameRoom';

import BigLogo from '@/components/logos/BigLogo';
import Button from '@/components/buttons/Button';

const Landing: NextPage = function Landing() {
  const { joinGame } = useContext(GameRoomContext);

  const router = useRouter();

  const onStartClick = () => {
    joinGame();
    router.push('/room/a');
  };

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        overflow: 'hidden',
      }}
    >
      <BigLogo />
      <div style={{ marginTop: '100px' }}>
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(() => async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
  },
}));

export default Landing;
