import { useMemo } from 'react';
import { generateKeyFromIndex } from '@/utils/component';
import { UnitMapValueObject } from '@/valueObjects';
import UnitSquare from './subComponents/UnitSquare';
import dataTestids from './dataTestids';

type Props = {
  unitMap: UnitMapValueObject;
  unitSize: number;
  onUnitClick?: (colIdx: number, rowIdx: number) => void;
};

function UnitBoard({ unitMap, unitSize, onUnitClick }: Props) {
  const unitMatrix = useMemo(() => unitMap.getUnitMatrix(), [unitMap]);

  return (
    <div data-testid={dataTestids.root} className="flex flex-row">
      {unitMatrix.map((unitMatrixCol, colIdx) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          className="flex flex-col"
          style={{
            width: unitSize,
          }}
        >
          {unitMatrixCol.map((unit, rowIdx) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                height: unitSize,
              }}
            >
              <UnitSquare
                alive={unit.getAlive()}
                hasTopBorder
                hasRightBorder={colIdx === unitMap.getWidth() - 1}
                hasBottomBorder={rowIdx === unitMap.getHeight() - 1}
                hasLeftBorder
                onClick={() => onUnitClick?.(colIdx, rowIdx)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default UnitBoard;
export { dataTestids };
