import { useCallback, useContext, useEffect, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';

import { MyWorldsContext } from '@/contexts/my-worlds-context';
import { WorldCard } from '@/components/cards/world-card';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { WorldModel } from '@/models/world/world/world-model';
import { Button } from '@/components/buttons/button';
import { CreateWorldModal } from '@/components/modals/create-world-modal';
import { Text } from '@/components/texts/text';

const Page: NextPage = function Page() {
  const [isConfirmingWorldDeletion, setIsConfirmingWorldDeletion] = useState(false);
  const [worldToDelete, setWorldToDelete] = useState<WorldModel | null>(null);

  const { myWorlds, getMyWorlds, deleteWorldStatusMap, deleteWorld } = useContext(MyWorldsContext);

  useEffect(() => {
    getMyWorlds();
  }, []);

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

  const { isCreatingWorld, createWorld } = useContext(MyWorldsContext);
  const [isCreateWorldModalOpened, setIsCreateWorldModalOpened] = useState(false);

  const handleCreateNewWorldClick = useCallback(() => {
    setIsCreateWorldModalOpened(true);
  }, []);

  const handleCreateWorldConfirm = useCallback(
    (worldName: string) => {
      createWorld(worldName);
      setIsCreateWorldModalOpened(false);
    },
    [createWorld]
  );

  const handleCreateWorldCancel = useCallback(() => {
    setIsCreateWorldModalOpened(false);
  }, []);

  return (
    <DashboardLayout
      panel={
        <div className="flex justify-end items-center">
          <Button text="Create World" loading={isCreatingWorld} onClick={handleCreateNewWorldClick} />
        </div>
      }
    >
      <main className="flex gap-5 flex-col">
        <CreateWorldModal
          opened={isCreateWorldModalOpened}
          onConfirm={handleCreateWorldConfirm}
          onCancel={handleCreateWorldCancel}
        />
        <ConfirmModal
          opened={isConfirmingWorldDeletion}
          message={`Are you sure you want to delete world "${worldToDelete?.getName()}?"`}
          onComfirm={handleDeleteWorldConfirm}
          onCancel={handleDeleteWorldCancel}
        />
        <div className="rounded-3xl bg-stone-800 flex flex-col gap-5 p-6">
          <Text size="text-2xl" weight="font-bold">
            Recents
          </Text>
          <div className="flex flex-row gap-5">
            {myWorlds?.slice(0, 4).map((world) => {
              if (deleteWorldStatusMap[world.getId()]) {
                return (
                  <div key={world.getId()} className="basis-64">
                    <WorldCard world={world} deleting />
                  </div>
                );
              }
              return (
                <Link key={world.getId()} href={`/worlds/${world.getId()}`} className="basis-64">
                  <WorldCard world={world} onDeleteClick={() => handleDeleteWorldClick(world)} />
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
