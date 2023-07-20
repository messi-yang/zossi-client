import { useCallback, useState } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { Input } from '@/components/inputs/input';
import { dataTestids } from './data-test-ids';

type Props = {
  opened: boolean;
  onConfirm?: (worldName: string) => void;
  onCancel?: () => void;
};

export function CreateWorldModal({ opened, onConfirm = () => {}, onCancel = () => {} }: Props) {
  const [worldName, setWorldName] = useState('');

  const handleCreateClick = useCallback(() => {
    if (!worldName) return;
    onConfirm(worldName);
    setWorldName('');
  }, [worldName]);

  const handleCancelClick = useCallback(() => {
    setWorldName('');
    onCancel();
  }, []);

  return (
    <BaseModal width={300} opened={opened}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text color="text-white" size="text-lg">
          Create new world
        </Text>
        <div className="mt-5">
          <Input value={worldName} onInput={setWorldName} placeholder="Enter world name" />
        </div>
        <section className="mt-9 flex flex-row justify-center items-center">
          <Button text="Create" onClick={handleCreateClick} />
          <div className="ml-4">
            <Button text="Cancel" onClick={handleCancelClick} />
          </div>
        </section>
      </section>
    </BaseModal>
  );
}
