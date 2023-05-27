import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { QueryWorldsContext } from '@/contexts/query-worlds-context';
import { Text } from '@/components/texts/text';

const Landing: NextPage = function Landing() {
  const { worlds, queryWorlds } = useContext(QueryWorldsContext);

  useEffect(() => {
    queryWorlds();
  }, []);

  return (
    <main className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
      {worlds?.map((world) => (
        <div key={world.getId()}>
          <Link href={`/worlds/${world.getId()}`}>
            <Text color="text-white">{world.getName()}</Text>
          </Link>
        </div>
      ))}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Landing;
