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
        hovered && 'bg-[#575757]'
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
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
