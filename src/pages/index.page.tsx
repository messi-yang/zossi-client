import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { StyleContext } from '@/contexts/style-context';
import { WorldContext } from '@/contexts/world-context';
import { GameContext } from '@/contexts/game-context';

import { BigLogo } from '@/components/logos/big-logo';
import { Button } from '@/components/buttons/button';

const Landing: NextPage = function Landing() {
  const styleContext = useContext(StyleContext);
  const { worlds } = useContext(WorldContext);
  const { joinGame } = useContext(GameContext);
  const deviceSize: 'large' | 'small' = styleContext.getWindowWidth() > 475 ? 'large' : 'small';

  const router = useRouter();

  const onStartClick = () => {
    if (!worlds) return;

    const worldId = worlds[0].getId() as string | null;
    if (!worldId) return;

    joinGame(worldId);
    router.push(`/world/${worldId}`);
  };

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]"
      style={{
        width: styleContext.windowWidth,
        height: styleContext.windowHeight,
      }}
    >
      <BigLogo width={deviceSize === 'large' ? undefined : styleContext.getWindowWidth() * 0.8} />
      <div className="mt-[100px]">
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export default Landing;
