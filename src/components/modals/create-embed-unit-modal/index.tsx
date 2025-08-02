import { useCallback, useState } from 'react';
import { Text } from '@/components/texts/text';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { Input } from '@/components/inputs/input';
import { dataTestids } from './data-test-ids';
import { Field } from '@/components/fields/field';

type Props = {
  opened: boolean;
  onConfirm?: (label: string, embedCode: string) => void;
  onCancel?: () => void;
};

export function CreateEmbedUnitModal({ opened, onConfirm = () => {}, onCancel = () => {} }: Props) {
  const [label, setLabel] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const handleCreateClick = useCallback(() => {
    if (!label || !embedCode) return;
    onConfirm(label, embedCode);
    setLabel('');
    setEmbedCode('');
  }, [label, embedCode]);

  const handleCancelClick = useCallback(() => {
    setLabel('');
    setEmbedCode('');
    onCancel();
  }, []);

  return (
    <BaseModal width={400} opened={opened}>
      <section data-testid={dataTestids.root} className="relative w-full h-full flex flex-col items-center">
        <Text size="text-lg">Create Embed Unit</Text>
        <div className="mt-5 w-full">
          <Field label="Label">
            <Input value={label} onInput={setLabel} placeholder="Enter label" />
          </Field>
          <Field label="Embed code">
            <Input value={embedCode} onInput={setEmbedCode} placeholder="Enter embed code" />
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
