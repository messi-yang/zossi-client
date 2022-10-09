import cloneDeep from 'lodash/cloneDeep';
import UnitMapCanvas from '@/components/canvas/UnitMapCanvas';
import { UnitPatternValueObject } from '@/valueObjects';
import { createUnitPattern, createUnitMapByUnitPattern } from '@/valueObjects/factories';
import dataTestids from './dataTestids';

type Props = {
  unitSize: number;
  unitPattern: UnitPatternValueObject;
  editable: boolean;
  onUpdate?: (unitPattern: UnitPatternValueObject) => any;
};

function UnitPatternEditor({ unitSize, unitPattern, editable, onUpdate = () => {} }: Props) {
  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newUnitPattern = cloneDeep(unitPattern);
    newUnitPattern.setPatternUnit(colIdx, rowIdx, !newUnitPattern.isAlive(colIdx, rowIdx));

    onUpdate(newUnitPattern);
  };

  const hoverUnitPattern = editable ? createUnitPattern([[true]]) : createUnitPattern([[]]);

  return (
    <div className="inline-flex" data-testid={dataTestids.root}>
      <UnitMapCanvas
        unitMap={createUnitMapByUnitPattern(unitPattern)}
        unitSize={unitSize}
        unitPattern={hoverUnitPattern}
        onClick={editable ? handleSquareClick : () => {}}
      />
    </div>
  );
}

export default UnitPatternEditor;
export { dataTestids };
