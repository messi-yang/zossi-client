import { useMemo } from 'react';
import { generateKeyFromIndex } from '@/utils/component';
import { UnitBlockValueObject } from '@/models/valueObjects';
import UnitSquare from './subComponents/UnitSquare';
import dataTestids from './dataTestids';

type Props = {
  unitBlock: UnitBlockValueObject;
  unitSize: number;
  onUnitClick?: (colIdx: number, rowIdx: number) => void;
};

function UnitBoard({ unitBlock, unitSize, onUnitClick }: Props) {
  const unitMatrix = useMemo(() => unitBlock.getUnitMatrix(), [unitBlock]);

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
                hasRightBorder={colIdx === unitBlock.getWidth() - 1}
                hasBottomBorder={rowIdx === unitBlock.getHeight() - 1}
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
