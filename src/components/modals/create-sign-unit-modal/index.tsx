import { useCallback, useState } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { Input } from '@/components/inputs/input';
import { dataTestids } from './data-test-ids';
import { Field } from '@/components/fields/field';

type Props = {
  opened: boolean;
  onConfirm?: (label: string) => void;
  onCancel?: () => void;
};

export function CreateSignUnitModal({ opened, onConfirm = () => {}, onCancel = () => {} }: Props) {
  const [label, setLabel] = useState('');

  const handleCreateClick = useCallback(() => {
    if (!label) return;
    onConfirm(label);
    setLabel('');
  }, [label]);

  const handleCancelClick = useCallback(() => {
    setLabel('');
    onCancel();
  }, []);

  return (
    <BaseModal width={400} opened={opened}>
      <section data-testid={dataTestids.root} className="relative w-full h-full flex flex-col items-center">
        <Text size="text-lg">Create Link Unit</Text>
        <div className="mt-5 w-full">
          <Field label="Label">
            <Input value={label} onInput={setLabel} placeholder="Enter label" />
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
