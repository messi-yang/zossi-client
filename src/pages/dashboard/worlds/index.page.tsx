import { useCallback, useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { MyWorldsContext } from '@/contexts/my-worlds-context';
import { WorldCard } from '@/components/cards/world-card';
import { Button } from '@/components/buttons/button';
import { DashboardLayout } from '@/layouts/dashboard-layout';

const Page: NextPage = function Page() {
  const { myWorlds, getMyWorlds, isCreatingWorld, createWorld } = useContext(MyWorldsContext);
  useEffect(() => {
    getMyWorlds();
  }, []);

  const handleCreateNewWorldClick = useCallback(() => {
    createWorld('New world');
  }, []);

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#1E1E1E] p-10">
        <div className="flex justify-end">
          <Button text={isCreatingWorld ? 'Creating...' : 'Create New World'} onClick={handleCreateNewWorldClick} />
        </div>
        <div className="relative mt-8 w-full flex flex-col">
          {myWorlds?.map((world) => (
            <Link key={world.getId()} href={`/worlds/${world.getId()}`} className="mb-5">
              <WorldCard world={world} />
            </Link>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
