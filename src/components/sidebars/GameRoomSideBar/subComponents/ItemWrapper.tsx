type Props = {
  hovered: boolean;
  children: JSX.Element;
  onClick?: () => any;
  onMouseEnter?: () => any;
  onMouseLeave?: () => any;
};

function ItemWrapper({
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
    </section>
  );
}

export default ItemWrapper;
