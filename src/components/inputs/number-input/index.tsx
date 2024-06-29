import classnames from 'classnames';
import { dataTestids } from './data-test-ids';

type Props = {
  value: number;
  step: number;
  onInput?: (value: number) => void;
};

export function NumberInput({ value, step, onInput = () => {} }: Props) {
  return (
    <input
      data-testid={dataTestids.root}
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
      value={value}
      type="number"
      step={step}
      onChange={(e) => {
        const number = parseInt(e.target.value, 10);
        onInput(number);
      }}
    />
  );
}
