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
import range from 'lodash/range';
import CommandableUnitSquare from './CommandableUnitSquare';
import type { Commands as CommandableUnitSquareCommands } from './CommandableUnitSquare';

const squareSize = 20;

export type Commands = {
  setUnitHighlighted: (
    colIdx: number,
    rowIdx: number,
    highlighted: boolean
  ) => void;
  setUnitAlive: (colIdx: number, rowIdx: number, alive: boolean) => void;
};

type Props = {
  width: number;
  height: number;
  onUnitSquareClick: (colIdx: number, rowIdx: number) => void;
  onUnitSquareHover: (colIdx: number, rowIdx: number) => void;
};

function UnitSquares(
  { width, height, onUnitSquareClick, onUnitSquareHover }: Props,
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
        colIdx: number,
        rowIdx: number,
        highlighted: boolean
      ) => {
        unitSquareCompRefs?.[colIdx]?.[rowIdx]?.current?.setHighlighted(
          highlighted
        );
      },
      setUnitAlive: (colIdx: number, rowIdx: number, alive: boolean) => {
        unitSquareCompRefs?.[colIdx]?.[rowIdx]?.current?.setAlive(alive);
      },
    }),
    [unitSquareCompRefs]
  );

  return (
    <>
      {range(0, width).map((colIdx) => (
        <section
          key={colIdx}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {range(0, height).map((rowIdx) => (
            <section
              key={rowIdx}
              style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
            >
              {unitSquareCompRefs?.[colIdx]?.[rowIdx] && (
                <CommandableUnitSquare
                  ref={unitSquareCompRefs[colIdx][rowIdx]}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  hasTopBorder
                  hasRightBorder={colIdx === width - 1}
                  hasBottomBorder={rowIdx === height - 1}
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
