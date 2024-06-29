import { useCallback, useState } from 'react';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { dataTestids } from './data-test-ids';
import { Field } from '@/components/fields/field';
import { Text } from '@/components/texts/text';
import { NumberInput } from '@/components/inputs/number-input';

type Props = {
  opened: boolean;
  onComfirm: (duration: number, speed: number) => void;
  onCancel: () => void;
};

export function ReplayCommandsModal({ opened, onComfirm = () => {}, onCancel }: Props) {
  const [durationInSecond, setDurationInSecond] = useState(10);
  const [speed, setSpeed] = useState(1);

  const handleConfirm = useCallback(() => {
    onComfirm(durationInSecond * 1000, speed);
  }, [onComfirm, durationInSecond, speed]);

  return (
    <BaseModal opened={opened} onCrossClick={onCancel}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col gap-4 items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text>Replay</Text>
        <Field label="Duration">
          <NumberInput
            value={durationInSecond}
            step={1}
            onInput={(val) => {
              if (val < 1 || val > 30) return;
              setDurationInSecond(val);
            }}
          />
        </Field>
        <Field label="Speed">
          <NumberInput
            value={speed}
            step={1}
            onInput={(val) => {
              if (val < 1 || val > 10) return;
              setSpeed(val);
            }}
          />
        </Field>
        <Button text="Confirm" onClick={handleConfirm} />
      </section>
    </BaseModal>
  );
}
