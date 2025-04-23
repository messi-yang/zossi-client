import classnames from 'classnames';
import { dataTestids } from './data-test-ids';

type Props = {
  children: string | React.ReactNode | null;
  color?: 'text-stone-800' | 'text-stone-50';
  size?: 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-sm' | 'text-xs';
  weight?: 'font-normal' | 'font-bold';
};

export function Text({ children, color = 'text-stone-50', size = 'text-base', weight = 'font-normal' }: Props) {
  return (
    <span
      data-testid={dataTestids.root}
      className={classnames(color, size, weight, 'font-exo-2', 'tracking-wider', 'overflow-hidden', 'text-ellipsis')}
    >
      {children}
    </span>
  );
}
