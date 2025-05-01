import { KeyboardEventHandler, MouseEventHandler } from 'react';
import classnames from 'classnames';
import { Icon } from '@iconify/react';

import { dataTestids } from './data-test-ids';

type Props = {
  iconName: string;
  onClick: () => void;
};

export function IconButton({ iconName, onClick = () => {} }: Props) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return (
    <button
      data-testid={dataTestids.root}
      className={classnames(
        'inline-flex',
        'justify-center',
        'items-center',
        'cursor-pointer',
        'outline-none',
        'bg-none',
        'p-0',
        'rounded-lg',
        'text-white',
        'hover:text-blue-500',
        'hover:bg-blue-500',
        'hover:bg-opacity-20'
      )}
      type="button"
      aria-label="icon button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Icon icon={iconName} width={24} height={24} />
    </button>
  );
}
