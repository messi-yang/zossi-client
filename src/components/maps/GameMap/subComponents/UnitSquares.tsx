import { memo, useState, useEffect, RefObject, createRef, forwardRef, ForwardedRef, useImperativeHandle } from 'react';
import type { UnitVO } from '@/valueObjects';
import { generateKeyFromIndex } from '@/utils/component';
import CommandableUnitSquare from './CommandableUnitSquare';
import type { Commands as CommandableUnitSquareCommands } from './CommandableUnitSquare';

export type Commands = {
  setUnitHighlighted: (colIdx: number, rowIdx: number, highlighted: boolean) => void;
};

type Props = {
  width: number;
  height: number;
  unitMap: UnitVO[][];
  squareSize: number;
  onUnitSquareClick: (colIdx: number, rowIdx: number) => void;
  onUnitSquareMouseEnter: (colIdx: number, rowIdx: number) => void;
};

function UnitSquares(
  { width, height, unitMap, squareSize, onUnitSquareClick, onUnitSquareMouseEnter }: Props,
  ref: ForwardedRef<Commands>
) {
  const [unitSquareCompRefs, setUnitSquareCompRefs] = useState<RefObject<CommandableUnitSquareCommands>[][]>([]);

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
      setUnitHighlighted: (colIdx: number, rowIdx: number, highlighted: boolean) => {
        unitSquareCompRefs?.[colIdx]?.[rowIdx]?.current?.setHighlighted(highlighted);
      },
    }),
    [unitSquareCompRefs]
  );

  return (
    <>
      {unitMap.map((unitCol, colIdx) => (
        <section
          key={generateKeyFromIndex(colIdx)}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {unitCol.map((unit, rowIdx) => (
            <section key={generateKeyFromIndex(rowIdx)} style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}>
              <CommandableUnitSquare
                ref={unitSquareCompRefs?.[colIdx]?.[rowIdx]}
                rowIdx={rowIdx}
                colIdx={colIdx}
                alive={unit.alive}
                hasTopBorder
                hasRightBorder={colIdx === width - 1}
                hasBottomBorder={rowIdx === height - 1}
                hasLeftBorder
                onClick={onUnitSquareClick}
                onMouseEnter={onUnitSquareMouseEnter}
              />
            </section>
          ))}
        </section>
      ))}
    </>
  );
}

export default memo(forwardRef(UnitSquares));
