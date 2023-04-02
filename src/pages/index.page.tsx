import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import StyleContext from '@/contexts/StyleContext';
import WorldContext from '@/contexts/WorldContext';
import GameContext from '@/contexts/GameContext';

import BigLogo from '@/components/logos/BigLogo';
import Button from '@/components/buttons/Button';

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
    router.push(`/game/${worldId}`);
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
