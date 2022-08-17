import { useImperativeHandle, forwardRef, ForwardedRef, useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';

type Commands = {
  setHighlighted: (highlighted: boolean) => void;
};

type Props = {
  colIdx: number;
  rowIdx: number;
  alive: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (colIdx: number, rowIdx: number) => void;
  onMouseEnter: (colIdx: number, rowIdx: number) => void;
};

function CommandableUnitSquare(
  { colIdx, rowIdx, alive, hasTopBorder, hasRightBorder, hasBottomBorder, hasLeftBorder, onClick, onMouseEnter }: Props,
  ref: ForwardedRef<Commands>
) {
  const [highlighted, setHighlighted] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    setHighlighted: (newHighlighted: boolean) => {
      setHighlighted(newHighlighted);
    },
  }));

  const handleUnitSquareClick = useCallback(() => {
    onClick(colIdx, rowIdx);
  }, [colIdx, rowIdx, onClick]);

  const handleUnitSquareMouseEnter = useCallback(() => {
    onMouseEnter(colIdx, rowIdx);
  }, [colIdx, rowIdx, onMouseEnter]);

  return (
    <UnitSquare
      alive={alive}
      highlighted={highlighted}
      hasTopBorder={hasTopBorder}
      hasRightBorder={hasRightBorder}
      hasBottomBorder={hasBottomBorder}
      hasLeftBorder={hasLeftBorder}
      onClick={handleUnitSquareClick}
      onMouseEnter={handleUnitSquareMouseEnter}
    />
  );
}

export default memo(forwardRef(CommandableUnitSquare));
export type { Commands };
