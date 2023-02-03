import { KeyboardEventHandler, MouseEventHandler } from 'react';
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
  const handleClick: MouseEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    target.blur();
    onClick();
  };
  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    target.blur();
    onClick();
  };
  return (
    <section
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
