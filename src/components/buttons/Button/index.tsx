import { useRef, useState } from 'react';

import useHover from '@/hooks/useHover';

import ContentWrapper from './ContentWrapper';
import dataTestids from './dataTestids';

type Props = {
  text: string;
  onClick?: () => any;
};

function Button({ text, onClick = () => {} }: Props) {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<HTMLButtonElement>(null);
  useHover(nodeRef, setHovered);

  return (
    <button
      data-testid={dataTestids.root}
      ref={nodeRef}
      type="button"
      style={{
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        background: 'none',
      }}
      onClick={onClick}
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
