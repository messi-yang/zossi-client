import cloneDeep from 'lodash/cloneDeep';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from './subComponents/UnitSquare';
import { UnitPatternValueObject } from '@/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  unitSize: number;
  unitPattern: UnitPatternValueObject;
  onUpdate?: (unitPattern: UnitPatternValueObject) => any;
};

function UnitPatternEditor({ unitSize, unitPattern, onUpdate = () => {} }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newUnitPattern = cloneDeep(unitPattern);
    newUnitPattern.setPatternUnit(colIdx, rowIdx, !newUnitPattern.isAlive(colIdx, rowIdx));

    onUpdate(newUnitPattern);
  };

  return (
    <div data-testid={dataTestids.root} className="flex flex-row">
      {unitPattern.mapPatternColumn((colIdx: number) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          className="flex flex-col"
          style={{
            width: unitSize,
          }}
        >
          {unitPattern.mapPatternUnit(colIdx, (rowIdx: number, isAlive: boolean) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                height: unitSize,
              }}
            >
              <UnitSquare
                alive={isAlive}
                highlighted={false}
                borderColor="#2C2C2C"
                hasTopBorder
                hasRightBorder={colIdx === unitPattern.getWidth() - 1}
                hasBottomBorder={rowIdx === unitPattern.getHeight() - 1}
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
