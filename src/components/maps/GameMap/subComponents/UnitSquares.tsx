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
    localCoordinate: CoordinateEntity,
    highlighted: boolean
  ) => void;
};

type Props = {
  width: number;
  height: number;
  units: UnitEntity[][];
  onUnitSquareClick: (localCoordinate: CoordinateEntity) => void;
  onUnitSquareHover: (localCoordinate: CoordinateEntity) => void;
};

function UnitSquares(
  { width, height, units, onUnitSquareClick, onUnitSquareHover }: Props,
  ref: ForwardedRef<Commands>
) {
  const [unitSquareCompRefs, setUnitSquareCompRefs] = useState<
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
    setUnitSquareCompRefs(newRefs);
  }, [width, height]);

  useImperativeHandle(
    ref,
    () => ({
      setUnitHighlighted: (
        localCoordinate: CoordinateEntity,
        highlighted: boolean
      ) => {
        const localX = localCoordinate.x;
        const localY = localCoordinate.y;
        unitSquareCompRefs[localX][localY].current?.setHighlighted(highlighted);
      },
    }),
    [unitSquareCompRefs]
  );

  return (
    <>
      {units.map((columnOfUnits, localX) => (
        <section
          key={columnOfUnits[0].coordinate.x}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {columnOfUnits.map((unit, localY) => {
            const localCoordinate = { x: localX, y: localY };
            return (
              <section
                key={unit.coordinate.y}
                style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
              >
                {unitSquareCompRefs?.[localX]?.[localY] && (
                  <CommandableUnitSquare
                    ref={unitSquareCompRefs[localX][localY]}
                    coordinate={localCoordinate}
                    alive={unit.alive}
                    hasTopBorder
                    hasRightBorder={localX === units.length - 1}
                    hasBottomBorder={localY === columnOfUnits.length - 1}
                    hasLeftBorder
                    onClick={onUnitSquareClick}
                    onHover={onUnitSquareHover}
                  />
                )}
              </section>
            );
          })}
        </section>
      ))}
    </>
  );
}

export default memo(forwardRef(UnitSquares));
