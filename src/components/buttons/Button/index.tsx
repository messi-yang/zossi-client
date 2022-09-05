import { useState } from 'react';

import Text from '@/components/text/Text';

import ContentWrapper from './subComponents/ContentWrapper';
import dataTestids from './dataTestids';

type Props = {
  text: string;
  onClick?: () => any;
};

function Button({ text, onClick = () => {} }: Props) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <button
      data-testid={dataTestids.root}
      type="button"
      className="border-none outline-none cursor-none bg-none"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ContentWrapper hovered={hovered}>
        <div
          className={[
            'h-full',
            'flex',
            'py-0',
            'px-12',
            'justify-center',
            'items-center',
            hovered ? 'bg-white' : 'bg-none',
          ].join(' ')}
        >
          <Text color={hovered ? 'black' : 'white'} copy={text} size={16} />
        </div>
      </ContentWrapper>
    </button>
  );
}

export default Button;
export { dataTestids };
