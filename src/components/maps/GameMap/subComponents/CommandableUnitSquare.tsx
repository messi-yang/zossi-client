import {
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useState,
  useCallback,
  memo,
} from 'react';
import UnitSquare from '@/components/squares/UnitSquare';

type Commands = {
  setHighlighted: (highlighted: boolean) => void;
};

type Props = {
  rowIdx: number;
  colIdx: number;
  alive: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (rowIdx: number, colIdx: number) => void;
  onHover: (rowIdx: number, colIdx: number) => void;
};

function CommandableUnitSquare(
  {
    rowIdx,
    colIdx,
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

  const handleUnitSquareClick = useCallback(() => {
    onClick(rowIdx, colIdx);
  }, [rowIdx, colIdx]);

  const handleUnitSquareHover = useCallback(() => {
    onHover(rowIdx, colIdx);
  }, [rowIdx, colIdx]);

  return (
    <UnitSquare
      alive={alive}
      highlighted={highlighted}
      hasTopBorder={hasTopBorder}
      hasRightBorder={hasRightBorder}
      hasBottomBorder={hasBottomBorder}
      hasLeftBorder={hasLeftBorder}
      onClick={handleUnitSquareClick}
      onHover={handleUnitSquareHover}
    />
  );
}

export default memo(forwardRef(CommandableUnitSquare));
export type { Commands };
