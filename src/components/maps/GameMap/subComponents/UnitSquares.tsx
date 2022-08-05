import {
  memo,
  useState,
  useEffect,
  RefObject,
  createRef,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from 'react';
import type { UnitEntity, CoordinateEntity } from '@/entities';
import CommandableUnitSquare from './CommandableUnitSquare';
import type { Commands as CommandableUnitSquareCommands } from './CommandableUnitSquare';

const squareSize = 20;

export type Commands = {
  setUnitHighlighted: (
    coordinate: CoordinateEntity,
    highlighted: boolean
  ) => void;
};

type Props = {
  width: number;
  height: number;
  units: UnitEntity[][];
  onUnitSquareClick: (coordinate: CoordinateEntity) => void;
  onUnitSquareHover: (coordinate: CoordinateEntity) => void;
};

function UnitSquares(
  { width, height, units, onUnitSquareClick, onUnitSquareHover }: Props,
  ref: ForwardedRef<Commands>
) {
  const [unitCompRefs, setUnitCompRefs] = useState<
    RefObject<CommandableUnitSquareCommands>[][]
  >([]);

  useEffect(() => {
    const newRefs: RefObject<CommandableUnitSquareCommands>[][] = [];
    for (let x = 0; x < width; x += 1) {
      newRefs.push([]);
      for (let y = 0; y < height; y += 1) {
        newRefs[x].push(createRef());
      }
    }
    setUnitCompRefs(newRefs);
  }, [width, height]);

  useImperativeHandle(
    ref,
    () => ({
      setUnitHighlighted: (
        coordinate: CoordinateEntity,
        highlighted: boolean
      ) => {
        if (unitCompRefs?.[coordinate.x]?.[coordinate.y].current) {
          unitCompRefs[coordinate.x][coordinate.y].current?.setHighlighted(
            highlighted
          );
        }
      },
    }),
    [unitCompRefs]
  );

  return (
    <>
      {units.map((columnOfUnits, x) => (
        <section
          key={columnOfUnits[0].coordinate.x}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {columnOfUnits.map((unit, y) => (
            <section
              key={unit.coordinate.y}
              style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
            >
              {unitCompRefs?.[x]?.[y] && (
                <CommandableUnitSquare
                  ref={unitCompRefs[x][y]}
                  coordinate={{ x, y }}
                  alive={unit.alive}
                  hasTopBorder
                  hasRightBorder={x === units.length - 1}
                  hasBottomBorder={y === columnOfUnits.length - 1}
                  hasLeftBorder
                  onClick={onUnitSquareClick}
                  onHover={onUnitSquareHover}
                />
              )}
            </section>
          ))}
        </section>
      ))}
    </>
  );
}

export default memo(forwardRef(UnitSquares));
