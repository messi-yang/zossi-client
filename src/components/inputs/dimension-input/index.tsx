import { useMemo } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { NumberInput } from '../number-input';

type Props = {
  value: DimensionVo;
  onInput?: (newDimension: DimensionVo) => void;
};

export function DimensionInput({ value, onInput = () => {} }: Props) {
  const width = useMemo(() => value.getWidth(), [value]);
  const depth = useMemo(() => value.getDepth(), [value]);

  return (
    <div data-testid={dataTestids.root} className={classnames('flex', 'flex-row', 'gap-1', 'items-center')}>
      <NumberInput
        value={width}
        step={1}
        onInput={(number) => {
          onInput(DimensionVo.create(Number.isNaN(number) ? 0 : number, depth));
        }}
      />
      <NumberInput
        value={depth}
        step={1}
        onInput={(number) => {
          onInput(DimensionVo.create(width, Number.isNaN(number) ? 0 : number));
        }}
      />
    </div>
  );
}
