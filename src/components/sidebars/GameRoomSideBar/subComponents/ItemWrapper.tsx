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
      style={{
        width: '100%',
        height: '100%',
        flexBasis: '70px',
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hovered ? '#575757' : 'unset',
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      {label && (
        <div style={{ marginTop: '7px' }}>
          <Text copy={label} color={active || highlighted ? '#01D6C9' : 'white'} size={12} />
        </div>
      )}
    </section>
  );
}

export default ItemWrapper;
