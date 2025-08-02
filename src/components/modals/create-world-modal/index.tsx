import { useCallback, useState } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { Input } from '@/components/inputs/input';
import { dataTestids } from './data-test-ids';
import { Field } from '@/components/fields/field';

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
    <BaseModal width={400} opened={opened}>
      <section data-testid={dataTestids.root} className="relative w-full h-full flex flex-col items-center">
        <Text size="text-lg">Create new world</Text>
        <div className="mt-5 w-full">
          <Field label="Name">
            <Input value={worldName} onInput={setWorldName} placeholder="Enter world name" />
          </Field>
        </div>
        <section className="mt-9 w-full flex flex-row justify-end items-center">
          <Button text="Create" onClick={handleCreateClick} />
          <div className="ml-4">
            <Button text="Cancel" onClick={handleCancelClick} />
          </div>
        </section>
      </section>
    </BaseModal>
  );
}
