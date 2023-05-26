import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { QueryWorldsContext } from '@/contexts/query-worlds-context';
// import { GameContext } from '@/contexts/game-context';

const Landing: NextPage = function Landing() {
  const { worlds, queryWorlds } = useContext(QueryWorldsContext);
  // const { joinGame } = useContext(GameContext);

  useEffect(() => {
    queryWorlds();
  }, []);

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      {worlds?.map((world) => (
        <div key={world.getId()}>
          <Link href={`/worlds/${world.getId()}`}>{world.getId()}</Link>
        </div>
      ))}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Landing;
