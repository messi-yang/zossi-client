import { useMemo } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';
import { PositionVo } from '@/models/world/common/position-vo';
import { NumberInput } from '../number-input';

type Props = {
  value: PositionVo;
  onInput?: (newPosition: PositionVo) => void;
};

export function PositionInput({ value, onInput = () => {} }: Props) {
  const positionX = useMemo(() => value.getX(), [value]);
  const positionZ = useMemo(() => value.getZ(), [value]);

  return (
    <div data-testid={dataTestids.root} className={classnames('flex', 'flex-row', 'gap-1')}>
      <NumberInput
        value={positionX}
        step={1}
        onInput={(number) => {
          onInput(PositionVo.create(Number.isNaN(number) ? 0 : number, positionZ));
        }}
      />
      <NumberInput
        value={positionZ}
        step={1}
        onInput={(number) => {
          onInput(PositionVo.create(positionX, Number.isNaN(number) ? 0 : number));
        }}
      />
    </div>
  );
}
