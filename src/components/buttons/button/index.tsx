import { useState } from 'react';
import { Text } from '@/components/texts/tmp-text';
import { ContentWrapper } from './sub-components/content-wrapper';
import { dataTestids } from './data-test-ids';

type Props = {
  text: string;
  onClick?: () => any;
};

export function Button({ text, onClick = () => {} }: Props) {
  const [highlighted, setHighlighted] = useState(false);

  const handleMouseEnter = () => {
    setHighlighted(true);
  };

  const handleMouseLeave = () => {
    setHighlighted(false);
  };

  const handleFocus = () => {
    setHighlighted(true);
  };

  const handleBlure = () => {
    setHighlighted(false);
  };

  return (
    <button
      data-testid={dataTestids.root}
      type="button"
      className="border-none outline-none cursor-pointer bg-none"
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlure}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ContentWrapper highlighted={highlighted}>
        <div
          className={[
            'h-full',
            'flex',
            'py-0',
            'px-12',
            'justify-center',
            'items-center',
            highlighted ? 'bg-white' : 'bg-none',
          ].join(' ')}
        >
          <Text color={highlighted ? 'black' : 'white'} copy={text} size={16} />
        </div>
      </ContentWrapper>
    </button>
  );
}
