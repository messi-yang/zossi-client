import { useCallback, useState } from 'react';
import classnames from 'classnames';
import { Text } from '@/components/texts/text';
import { dataTestids } from './data-test-ids';

type Props = {
  text: string;
  fullWidth?: boolean;
  rightChild?: React.ReactNode;
  loading?: boolean;
  onClick?: () => any;
};

export function Button({ text, fullWidth = false, rightChild, loading = false, onClick = () => {} }: Props) {
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

  const handleClick = useCallback(() => {
    if (loading) return;
    onClick();
  }, [onClick, loading]);

  return (
    <button
      data-testid={dataTestids.root}
      type="button"
      className={classnames('relative', 'rounded-lg', 'overflow-hidden', 'backdrop-blur', 'h-10', fullWidth ? 'w-full' : undefined, 'px-5')}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlure}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={classnames(
          'absolute',
          'left-0',
          'top-0',
          'w-full',
          'h-full',
          'transition-opacity',
          'duration-200',
          'ease-out',
          highlighted ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          backgroundImage: 'linear-gradient(90.02deg, rgba(255, 255, 255, 0.2) 0.01%, rgba(255, 255, 255, 0.1) 99.98%)',
        }}
      />
      <div
        className={classnames(
          'absolute',
          'left-0',
          'top-0',
          'w-full',
          'h-full',
          'transition-opacity',
          'duration-200',
          'ease-out',
          highlighted ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundImage: 'linear-gradient(92.88deg, rgba(255, 255, 255, 0.25) 14.49%, rgba(255, 255, 255, 0.12) 98.56%)',
        }}
      />
      <div className={classnames('relative', 'z-10', 'w-full', 'h-full', 'flex', 'justify-center', 'items-center')}>
        <Text size="text-lg">{loading ? 'Processing...' : text}</Text>
        {rightChild && <div className="ml-2">{rightChild}</div>}
      </div>
    </button>
  );
}
