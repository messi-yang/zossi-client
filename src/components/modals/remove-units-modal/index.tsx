import { useCallback, useState } from 'react';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { dataTestids } from './data-test-ids';
import { PositionVo } from '@/models/world/common/position-vo';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { PositionInput } from '@/components/inputs/position-input';
import { DimensionInput } from '@/components/inputs/dimension-input';
import { Field } from '@/components/fields/field';
import { Text } from '@/components/texts/text';

type Props = {
  opened: boolean;
  onComfirm: (origin: PositionVo, dimension: DimensionVo) => void;
  onCancel: () => void;
};

export function RemoveUnitsModal({ opened, onComfirm = () => {}, onCancel }: Props) {
  const [origin, setOrigin] = useState(PositionVo.create(1, 1));
  const [dimension, setDimension] = useState(DimensionVo.create(1, 1));

  const handleConfirm = useCallback(() => {
    onComfirm(origin, dimension);
  }, [origin, dimension]);

  return (
    <BaseModal opened={opened} onCrossClick={onCancel}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col gap-4 items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text>Remove Units</Text>
        <Field label="Origin">
          <PositionInput value={origin} onInput={setOrigin} />
        </Field>
        <Field label="Dimension">
          <DimensionInput value={dimension} onInput={setDimension} />
        </Field>
        <Button text="Confirm" onClick={handleConfirm} />
      </section>
    </BaseModal>
  );
}
