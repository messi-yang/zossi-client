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
import type { UnitEntity } from '@/entities';
import CommandableUnitSquare from './CommandableUnitSquare';
import type { Commands as CommandableUnitSquareCommands } from './CommandableUnitSquare';

const squareSize = 20;

export type Commands = {
  setUnitHighlighted: (
    rowIdx: number,
    colIdx: number,
    highlighted: boolean
  ) => void;
};

type Props = {
  width: number;
  height: number;
  units: UnitEntity[][];
  onUnitSquareClick: (rowIdx: number, colIdx: number) => void;
  onUnitSquareHover: (rowIdx: number, colIdx: number) => void;
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
        rowIdx: number,
        colIdx: number,
        highlighted: boolean
      ) => {
        unitSquareCompRefs[rowIdx][colIdx].current?.setHighlighted(highlighted);
      },
    }),
    [unitSquareCompRefs]
  );

  return (
    <>
      {units.map((columnOfUnits, rowIdx) => (
        <section
          key={columnOfUnits[0].coordinate.x}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {columnOfUnits.map((unit, colIdx) => (
            <section
              key={unit.coordinate.y}
              style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
            >
              {unitSquareCompRefs?.[rowIdx]?.[colIdx] && (
                <CommandableUnitSquare
                  ref={unitSquareCompRefs[rowIdx][colIdx]}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  alive={unit.alive}
                  hasTopBorder
                  hasRightBorder={rowIdx === units.length - 1}
                  hasBottomBorder={colIdx === columnOfUnits.length - 1}
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
