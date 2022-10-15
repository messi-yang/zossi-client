type Props = {
  alive: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

function UnitSquare({
  alive,
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick = () => {},
  onMouseEnter = () => {},
}: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="game unit box"
      className={[
        'w-full',
        'h-full',
        'box-border',
        alive ? 'hover:bg-[#c8c8c8] bg-[white]' : 'hover:bg-[#4d4d4d] bg-[black]',
        'cursor-pointer',
        'select-none',
      ].join(' ')}
      style={{
        border: `1px solid #4d4d4d`,
        borderTop: hasTopBorder ? `1px solid rgba(20,20,20)` : '',
        borderRight: hasRightBorder ? `1px solid rgba(20,20,20)` : '',
        borderBottom: hasBottomBorder ? `1px solid rgba(20,20,20)` : '',
        borderLeft: hasLeftBorder ? `1px solid rgba(20,20,20)` : '',
      }}
      onClick={onClick}
      onKeyDown={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
}

export default UnitSquare;
