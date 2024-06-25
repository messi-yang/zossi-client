import { useMemo } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';
import { DimensionVo } from '@/models/world/common/dimension-vo';

type Props = {
  value: DimensionVo;
  onInput?: (newDimension: DimensionVo) => void;
};

export function DimensionInput({ value, onInput = () => {} }: Props) {
  const width = useMemo(() => value.getWidth(), [value]);
  const depth = useMemo(() => value.getDepth(), [value]);

  return (
    <div data-testid={dataTestids.root} className={classnames('flex', 'flex-row', 'gap-1', 'items-center')}>
      <input
        className={classnames(
          'flex',
          'min-w-0',
          'bg-gray-50',
          'border',
          'border-gray-300',
          'text-gray-900',
          'text-sm',
          'rounded-lg',
          'focus:ring-blue-500',
          'focus:border-blue-500',
          'p-2.5',
          'outline-none'
        )}
        value={width}
        type="number"
        step={1}
        onChange={(e) => {
          const number = parseInt(e.target.value, 10);
          onInput(DimensionVo.create(Number.isNaN(number) ? 0 : number, depth));
        }}
      />
      <input
        className={classnames(
          'flex',
          'min-w-0',
          'bg-gray-50',
          'border',
          'border-gray-300',
          'text-gray-900',
          'text-sm',
          'rounded-lg',
          'focus:ring-blue-500',
          'focus:border-blue-500',
          'p-2.5',
          'outline-none'
        )}
        value={depth}
        type="number"
        step={1}
        onChange={(e) => {
          const number = parseInt(e.target.value, 10);
          onInput(DimensionVo.create(width, Number.isNaN(number) ? 0 : number));
        }}
      />
    </div>
  );
}
