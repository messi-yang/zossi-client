import { KeyboardEventHandler, MouseEventHandler, useState } from 'react';
import classnames from 'classnames';

import { dataTestids } from './data-test-ids';
import { CrossIcon } from '@/components/icons/cross-icon';

export type Icon = 'cross';

function getIconComponent(icon: Icon, highlighted: boolean) {
  if (icon === 'cross') {
    return <CrossIcon width={24} highlighted={highlighted} />;
  }
  return null;
}

type Props = {
  icon: Icon;
  onClick: () => void;
};

export function IconButton({ icon, onClick = () => {} }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);

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

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <button
      data-testid={dataTestids.root}
      className={classnames(
        'w-8',
        'h-8',
        'inline-flex',
        'justify-center',
        'items-center',
        'cursor-pointer',
        'outline-none',
        'bg-none',
        'p-0',
        'hover:bg-stone-200',
        'hover:bg-opacity-50',
        'rounded-full'
      )}
      type="button"
      aria-label="icon button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIconComponent(icon, hovered)}
    </button>
  );
}
