import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { QueryWorldsContext } from '@/contexts/query-worlds-context';
import { WorldCard } from '@/components/cards/world-card';

const Landing: NextPage = function Landing() {
  const { worlds, queryWorlds } = useContext(QueryWorldsContext);

  useEffect(() => {
    queryWorlds();
  }, []);

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      {worlds?.map((world) => (
        <Link key={world.getId()} href={`/worlds/${world.getId()}`} className="mb-5">
          <WorldCard world={world} />
        </Link>
      ))}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Landing;
