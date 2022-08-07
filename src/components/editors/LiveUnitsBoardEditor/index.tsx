import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import dataTestids from './dataTestids';

type LiveUnitsBoard = boolean[][];

type Props = {
  liveUnitsBoard: LiveUnitsBoard;
  onUpdate: (liveUnitsBoard: LiveUnitsBoard) => any;
};

function LiveUnitsBoardEditor({ liveUnitsBoard, onUpdate }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newLiveUnitsBoard = cloneDeep(liveUnitsBoard);
    newLiveUnitsBoard[colIdx][rowIdx] = !newLiveUnitsBoard[colIdx][rowIdx];

    onUpdate(newLiveUnitsBoard);
  };

  return (
    <div data-testid={dataTestids.root} style={{ display: 'flex', flexFlow: 'row' }}>
      {liveUnitsBoard.map((colInLiveUnitsBoard, colIdx) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {colInLiveUnitsBoard.map((isTurnedOn, rowIdx) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <UnitSquare
                alive={isTurnedOn}
                highlighted={false}
                hasTopBorder
                hasRightBorder={colIdx === liveUnitsBoard.length - 1}
                hasBottomBorder={rowIdx === colInLiveUnitsBoard.length - 1}
                hasLeftBorder
                onClick={() => handleSquareClick(colIdx, rowIdx)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LiveUnitsBoardEditor;
export { dataTestids };
export type { LiveUnitsBoard };
