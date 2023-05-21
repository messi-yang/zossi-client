import { ReactFragment } from 'react';
import classnames from 'classnames';
import { dataTestids } from './data-test-ids';

type Props = {
  children: string | JSX.Element | ReactFragment | null;
  color?: 'text-black' | 'text-white';
  size?: 'text-base' | 'text-lg' | 'text-xl';
};

export function Text({ children, color = 'text-white', size = 'text-base' }: Props) {
  return (
    <span data-testid={dataTestids.root} className={classnames(color, size, 'font-exo-2', 'tracking-wider')}>
      {children}
    </span>
  );
}
