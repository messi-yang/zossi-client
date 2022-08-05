import {
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useState,
  memo,
} from 'react';
import { CoordinateEntity } from '@/entities';
import UnitSquare from '@/components/squares/UnitSquare';

type Commands = {
  setHighlighted: (highlighted: boolean) => void;
};

type Props = {
  coordinate: CoordinateEntity;
  alive: boolean;
  hasTopBorder: boolean;
  hasRightBorder: boolean;
  hasBottomBorder: boolean;
  hasLeftBorder: boolean;
  onClick: (localCoordinate: CoordinateEntity) => void;
  onHover: (localCoordinate: CoordinateEntity) => void;
};

function CommandableUnitSquare(
  {
    coordinate,
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
      coordinate={coordinate}
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
