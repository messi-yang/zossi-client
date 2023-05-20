import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { WorldContext } from '@/contexts/world-context';
import { GameContext } from '@/contexts/game-context';
import { AuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/buttons/button';
import { Text } from '@/components/texts/text';

const Landing: NextPage = function Landing() {
  const { worlds, fetchWorlds } = useContext(WorldContext);
  const { joinGame } = useContext(GameContext);
  const { singedIn } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    fetchWorlds();
  }, []);

  const onStartClick = () => {
    if (!worlds) return;

    const worldId = worlds[0].getId() as string | null;
    if (!worldId) return;

    joinGame(worldId);
    router.push(`/worlds/${worldId}`);
  };

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      <div className="absolute top-0 left-0 w-full flex justify-end h-10 px-6">
        {!singedIn && (
          <Link href="auth/signin" className="flex items-center">
            <Text color="text-white">Log in</Text>
          </Link>
        )}
      </div>
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

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Landing;
