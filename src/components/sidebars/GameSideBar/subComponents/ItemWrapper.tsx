import { KeyboardEventHandler, MouseEventHandler, useRef, useCallback } from 'react';
import classnames from 'classnames';
import Text from '@/components/text/Text';

type Props = {
  label?: string;
  highlighted: boolean;
  active: boolean;
  hovered: boolean;
  children: JSX.Element;
  onClick?: () => any;
  onMouseEnter?: () => any;
  onMouseLeave?: () => any;
};

function ItemWrapper({
  label,
  highlighted,
  active,
  hovered,
  children,
  onClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const handleClick: MouseEventHandler<HTMLElement> = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }
    wrapperRef.current.blur();
    onClick();
  }, [wrapperRef, onClick]);
  const handleKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }
    wrapperRef.current.blur();
    onClick();
  }, [wrapperRef, onClick]);
  return (
    <section
      ref={wrapperRef}
      className={classnames(
        'w-full',
        'h-full',
        'basis-[78px]',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'cursor-pointer',
        'outline-none',
        'focus:bg-red-600',
        hovered && 'bg-[#575757]'
      )}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {label && (
        <div className="mt-2 flex">
          <Text copy={label} color={active || highlighted ? '#01D6C9' : 'white'} size={12} />
        </div>
      )}
    </section>
  );
}

export default ItemWrapper;
