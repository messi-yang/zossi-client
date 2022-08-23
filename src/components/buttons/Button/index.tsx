import { useState } from 'react';

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
      style={{
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        background: 'none',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ContentWrapper hovered={hovered}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            padding: '0 48px',
            justifyContent: 'center',
            alignItems: 'center',
            background: hovered ? 'white' : 'none',
          }}
        >
          <span
            style={{
              color: hovered ? 'black' : 'white',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {text}
          </span>
        </div>
      </ContentWrapper>
    </button>
  );
}

export default Button;
export { dataTestids };
