import classnames from 'classnames';
import { dataTestids } from './data-test-ids';

type Props = {
  children: string | React.ReactNode | null;
  color?: 'text-stone-800' | 'text-stone-50' | 'text-white' | 'text-current';
  size?: 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-sm' | 'text-xs';
  weight?: 'font-normal' | 'font-bold' | 'font-medium';
  align?: 'text-left' | 'text-right' | 'text-center';
  lineHeight?: 'leading-none' | 'leading-tight' | 'leading-normal' | 'leading-relaxed' | 'leading-loose';
};

export function Text({
  children,
  color = 'text-stone-50',
  size = 'text-base',
  weight = 'font-normal',
  align = 'text-left',
  lineHeight = 'leading-tight',
}: Props) {
  return (
    <span
      data-testid={dataTestids.root}
      className={classnames(
        color,
        size,
        weight,
        'font-exo-2',
        'tracking-wider',
        'overflow-hidden',
        'text-ellipsis',
        'text-wrap',
        align,
        lineHeight
      )}
    >
      {children}
    </span>
  );
}
