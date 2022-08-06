import { useImperativeHandle, forwardRef, ForwardedRef, useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';

type Commands = {
  setHighlighted: (highlighted: boolean) => void;
  setAlive: (alive: boolean) => void;
};

type Props = {
  colIdx: number;
  rowIdx: number;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (colIdx: number, rowIdx: number) => void;
  onMouseEnter: (colIdx: number, rowIdx: number) => void;
  onMouseLeave: (colIdx: number, rowIdx: number) => void;
};

function CommandableUnitSquare(
  {
    colIdx,
    rowIdx,
    hasTopBorder,
    hasRightBorder,
    hasBottomBorder,
    hasLeftBorder,
    onClick,
    onMouseEnter,
    onMouseLeave,
  }: Props,
  ref: ForwardedRef<Commands>
) {
  const [highlighted, setHighlighted] = useState<boolean>(false);
  const [alive, setAlive] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    setHighlighted: (newHighlighted: boolean) => {
      setHighlighted(newHighlighted);
    },
    setAlive: (newAlive: boolean) => {
      setAlive(newAlive);
    },
  }));

  const handleUnitSquareClick = useCallback(() => {
    onClick(colIdx, rowIdx);
  }, [colIdx, rowIdx, onClick]);

  const handleUnitSquareMouseEnter = useCallback(() => {
    onMouseEnter(colIdx, rowIdx);
  }, [colIdx, rowIdx, onMouseEnter]);

  const handleUnitSquareMouseLeave = useCallback(() => {
    onMouseLeave(colIdx, rowIdx);
  }, [colIdx, rowIdx, onMouseLeave]);

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
      onMouseLeave={handleUnitSquareMouseLeave}
    />
  );
}

export default memo(forwardRef(CommandableUnitSquare));
export type { Commands };
