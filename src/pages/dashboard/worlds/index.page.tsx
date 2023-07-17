import { useCallback, useContext, useEffect, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { MyWorldsContext } from '@/contexts/my-worlds-context';
import { WorldCard } from '@/components/cards/world-card';
import { Button } from '@/components/buttons/button';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { WorldModel } from '@/models';

const Page: NextPage = function Page() {
  const [isConfirmingWorldDeletion, setIsConfirmingWorldDeletion] = useState(false);
  const [worldToDelete, setWorldToDelete] = useState<WorldModel | null>(null);

  const { myWorlds, getMyWorlds, isCreatingWorld, createWorld, deleteWorldStatusMap, deleteWorld } =
    useContext(MyWorldsContext);

  useEffect(() => {
    getMyWorlds();
  }, []);

  const handleCreateNewWorldClick = useCallback(() => {
    createWorld('New world');
  }, [createWorld]);

  const handleDeleteWorldClick = useCallback((world: WorldModel) => {
    setIsConfirmingWorldDeletion(true);
    setWorldToDelete(world);
  }, []);

  const handleDeleteWorldConfirm = useCallback(() => {
    if (!worldToDelete) return;
    deleteWorld(worldToDelete.getId());
    setIsConfirmingWorldDeletion(false);
  }, [worldToDelete, deleteWorld]);

  const handleDeleteWorldCancel = useCallback(() => {
    setIsConfirmingWorldDeletion(false);
    setWorldToDelete(null);
  }, []);

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#1E1E1E] p-10">
        <ConfirmModal
          opened={isConfirmingWorldDeletion}
          message={`Are you sure you want to delete world "${worldToDelete?.getName()}?"`}
          onComfirm={handleDeleteWorldConfirm}
          onCancel={handleDeleteWorldCancel}
        />
        <div className="flex justify-end">
          <Button text={isCreatingWorld ? 'Creating...' : 'Create New World'} onClick={handleCreateNewWorldClick} />
        </div>
        <div className="relative mt-8 w-full flex flex-col">
          {myWorlds?.map((world) => {
            if (deleteWorldStatusMap[world.getId()]) {
              return (
                <div key={world.getId()} className="mb-5">
                  <WorldCard world={world} deleting />
                </div>
              );
            }
            return (
              <Link key={world.getId()} href={`/worlds/${world.getId()}`} className="mb-5">
                <WorldCard world={world} onDeleteClick={() => handleDeleteWorldClick(world)} />
              </Link>
            );
          })}
        </div>
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
