import {
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useState,
  memo,
} from 'react';
import UnitSquare from '@/components/squares/UnitSquare';

type Commands = {
  setHighlighted: (highlighted: boolean) => void;
};

type Props = {
  x: number;
  y: number;
  alive: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (x: number, y: number) => void;
  onHover: (x: number, y: number) => void;
};

function CommandableUnitSquare(
  {
    x,
    y,
    alive,
    hasTopBorder,
    hasRightBorder,
    hasBottomBorder,
    hasLeftBorder,
    onClick,
    onHover,
  }: Props,
  ref: ForwardedRef<Commands>
) {
  const [highlighted, setHighlighted] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    setHighlighted: (newHighlighted: boolean) => {
      setHighlighted(newHighlighted);
    },
  }));

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

export default memo(forwardRef(CommandableUnitSquare));
export type { Commands };
