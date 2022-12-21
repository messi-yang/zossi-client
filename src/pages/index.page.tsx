import { useContext } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useWindowSize from '@/hooks/useWindowSize';
import { getInitialLocale } from '@/utils/i18n';
import GameRoomContext from '@/contexts/GameRoom';

import BigLogo from '@/components/logos/BigLogo';
import Button from '@/components/buttons/Button';

const Landing: NextPage = function Landing() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 475 ? 'large' : 'small';
  const { joinGame } = useContext(GameRoomContext);

  const router = useRouter();

  const onStartClick = () => {
    joinGame();
    router.push('/room/a');
  };

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: windowSize.width,
        height: windowSize.height,
        backgroundColor: '#1E1E1E',
      }}
    >
      <BigLogo width={deviceSize === 'large' ? undefined : windowSize.width * 0.8} />
      <div className="mt-[100px]">
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
  },
});

export default Landing;
