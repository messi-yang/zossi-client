import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { MyWorldsContext } from '@/contexts/my-worlds-context';
import { WorldCard } from '@/components/cards/world-card';
import { DashboardLayout } from '@/layouts/dashboard-layout';

const Page: NextPage = function Page() {
  const { myWorlds, getMyWorlds } = useContext(MyWorldsContext);
  useEffect(() => {
    getMyWorlds();
  }, []);

  return (
    <DashboardLayout>
      <main className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]">
        {myWorlds?.map((world) => (
          <Link key={world.getId()} href={`/worlds/${world.getId()}`} className="mb-5">
            <WorldCard world={world} />
          </Link>
        ))}
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
