import { useMemo } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';
import { PositionVo } from '@/models/world/common/position-vo';

type Props = {
  value: PositionVo;
  onInput?: (newPosition: PositionVo) => void;
};

export function PositionInput({ value, onInput = () => {} }: Props) {
  const positionX = useMemo(() => value.getX(), [value]);
  const positionZ = useMemo(() => value.getZ(), [value]);

  return (
    <div data-testid={dataTestids.root} className={classnames('flex', 'flex-row', 'gap-1')}>
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
        value={positionX}
        type="number"
        step={1}
        onChange={(e) => {
          const number = parseInt(e.target.value, 10);
          onInput(PositionVo.create(Number.isNaN(number) ? 0 : number, positionZ));
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
        value={positionZ}
        type="number"
        step={1}
        onChange={(e) => {
          const number = parseInt(e.target.value, 10);
          onInput(PositionVo.create(positionX, Number.isNaN(number) ? 0 : number));
        }}
      />
    </div>
  );
}
