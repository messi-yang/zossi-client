import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import type { LiveUnitBoardEntity } from '@/entities/';
import dataTestids from './dataTestids';

type Props = {
  liveUnitBoard: LiveUnitBoardEntity;
  onUpdate: (liveUnitBoard: LiveUnitBoardEntity) => any;
};

function LiveUnitBoardEditor({ liveUnitBoard, onUpdate }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newLiveUnitsBoard = cloneDeep(liveUnitBoard);
    newLiveUnitsBoard[colIdx][rowIdx] = !newLiveUnitsBoard[colIdx][rowIdx];

    onUpdate(newLiveUnitsBoard);
  };

  return (
    <div data-testid={dataTestids.root} style={{ display: 'flex', flexFlow: 'row' }}>
      {liveUnitBoard.map((colInLiveUnitsBoard, colIdx) => (
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
                hasRightBorder={colIdx === liveUnitBoard.length - 1}
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

export default LiveUnitBoardEditor;
export { dataTestids };
