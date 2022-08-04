import UnitSquare from '@/components/squares/UnitSquare';

type Props = {
  x: number;
  y: number;
  alive: boolean;
  highlighted: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (x: number, y: number) => void;
  onHover: (x: number, y: number) => void;
};

function CommandableUnitSquare({
  x,
  y,
  alive,
  highlighted,
  hasTopBorder,
  hasRightBorder,
  hasBottomBorder,
  hasLeftBorder,
  onClick,
  onHover,
}: Props) {
  return (
    <UnitSquare
      x={x}
      y={y}
      alive={alive}
      highlighted={highlighted}
      hasTopBorder={hasTopBorder}
      hasRightBorder={hasRightBorder}
      hasBottomBorder={hasBottomBorder}
      hasLeftBorder={hasLeftBorder}
      onClick={onClick}
      onHover={onHover}
    />
  );
}

export default CommandableUnitSquare;
