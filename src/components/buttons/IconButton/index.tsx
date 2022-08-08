import { useState } from 'react';

import dataTestids from './dataTestids';
import CrossIcon from '@/components/icons/CrossIcon';

export type Icon = 'cross';

function getIconComponent(icon: Icon, highlighted: boolean) {
  if (icon === 'cross') {
    <CrossIcon highlighted={highlighted} />;
  }
  return null;
}

type Props = {
  icon: Icon;
  onClick: () => any;
};

function IconButton({ icon, onClick = () => {} }: Props) {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <button
      data-testid={dataTestids.root}
      style={{
        display: 'inline-flex',
        cursor: 'pointer',
        outline: 'none',
        border: 'none',
        background: 'none',
        padding: '0',
      }}
      type="button"
      aria-label="icon button"
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getIconComponent(icon, hovered)}
    </button>
  );
}

export default IconButton;
export { dataTestids };
