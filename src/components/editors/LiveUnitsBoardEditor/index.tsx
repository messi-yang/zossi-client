import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import type { LiveUnitBoardEntity } from '@/entities/';
import dataTestids from './dataTestids';

type Props = {
  liveUnitsBoard: LiveUnitBoardEntity;
  onUpdate: (liveUnitsBoard: LiveUnitBoardEntity) => any;
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
          {colInLiveUnitsBoard.map((hasLiveUnit, rowIdx) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <UnitSquare
                alive={hasLiveUnit || false}
                highlighted={false}
                borderColor="#2C2C2C"
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
