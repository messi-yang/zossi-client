import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import type { UnitPatternVO } from '@/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  unitSize: number;
  unitPattern: UnitPatternVO;
  onUpdate?: (unitPattern: UnitPatternVO) => any;
};

function UnitPatternEditor({ unitSize, unitPattern, onUpdate = () => {} }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newUnitPattern = cloneDeep(unitPattern);
    newUnitPattern[colIdx][rowIdx] = newUnitPattern[colIdx][rowIdx] === true ? null : true;

    onUpdate(newUnitPattern);
  };

  return (
    <div data-testid={dataTestids.root} style={{ display: 'flex', flexFlow: 'row' }}>
      {unitPattern.map((unitCol, colIdx) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          style={{
            display: 'flex',
            width: unitSize,
            flexFlow: 'column',
          }}
        >
          {unitCol.map((isTruthy, rowIdx) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                height: unitSize,
              }}
            >
              <UnitSquare
                alive={isTruthy || false}
                highlighted={false}
                borderColor="#2C2C2C"
                hasTopBorder
                hasRightBorder={colIdx === unitPattern.length - 1}
                hasBottomBorder={rowIdx === unitCol.length - 1}
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

export default UnitPatternEditor;
export { dataTestids };
