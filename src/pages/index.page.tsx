import { useContext } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { WorldContext } from '@/contexts/world-context';
import { GameContext } from '@/contexts/game-context';

import { Button } from '@/components/buttons/tmp-button';

const Landing: NextPage = function Landing() {
  const { worlds } = useContext(WorldContext);
  const { joinGame } = useContext(GameContext);

  const router = useRouter();

  const onStartClick = () => {
    if (!worlds) return;

    const worldId = worlds[0].getId() as string | null;
    if (!worldId) return;

    joinGame(worldId);
    router.push(`/world/${worldId}`);
  };

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      <div className="sm:hidden">
        <Image src="/assets/big-logo.png" alt="big logo" width={203} height={150} />
      </div>
      <div className="hidden sm:inline-block">
        <Image src="/assets/big-logo.png" alt="big logo" width={406} height={231} />
      </div>
      <div className="mt-8 sm:mt-20">
        <Button text="Start" onClick={onStartClick} />
      </div>
    </main>
  );
};

export default Landing;
