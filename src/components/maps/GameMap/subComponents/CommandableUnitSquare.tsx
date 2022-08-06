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
  onHover: (colIdx: number, rowIdx: number) => void;
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
    onHover,
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
  }, [colIdx, rowIdx]);

  const handleUnitSquareHover = useCallback(() => {
    onHover(colIdx, rowIdx);
  }, [colIdx, rowIdx]);

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
