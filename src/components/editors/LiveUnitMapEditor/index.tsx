import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import type { LiveUnitMapEntity } from '@/entities/';
import dataTestids from './dataTestids';

type Props = {
  liveUnitMap: LiveUnitMapEntity;
  onUpdate: (liveUnitMap: LiveUnitMapEntity) => any;
};

function LiveUnitMapEditor({ liveUnitMap, onUpdate }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newLiveUnitMap = cloneDeep(liveUnitMap);
    newLiveUnitMap[colIdx][rowIdx] = newLiveUnitMap[colIdx][rowIdx] === true ? null : true;

    onUpdate(newLiveUnitMap);
  };

  return (
    <div data-testid={dataTestids.root} style={{ display: 'flex', flexFlow: 'row' }}>
      {liveUnitMap.map((colInLiveUnitMap, colIdx) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {colInLiveUnitMap.map((hasLiveUnit, rowIdx) => (
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
                hasRightBorder={colIdx === liveUnitMap.length - 1}
                hasBottomBorder={rowIdx === colInLiveUnitMap.length - 1}
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

export default LiveUnitMapEditor;
export { dataTestids };
