import { useMemo } from 'react';
import { UnitPatternValueObject } from '@/valueObjects';
import { createUnitBlockByUnitPattern } from '@/valueObjects/factories';
import UnitBoard from '@/components/boards/UnitBoard';
import dataTestids from './dataTestids';

type Props = {
  unitSize: number;
  unitPattern: UnitPatternValueObject;
  onUpdate: (unitPattern: UnitPatternValueObject) => any;
};

function UnitPatternEditor({ unitSize, unitPattern, onUpdate = () => {} }: Props) {
  const handleUnitClick = (colIdx: number, rowIdx: number) => {
    const newUnitPattern = unitPattern.setPatternUnit(colIdx, rowIdx, !unitPattern.isAlive(colIdx, rowIdx));

    const newUnitPatternWithFillterBorder = newUnitPattern.addFillerBorder();

    onUpdate(newUnitPatternWithFillterBorder);
  };

  const unitBlock = useMemo(() => createUnitBlockByUnitPattern(unitPattern), [unitPattern]);

  return (
    <div data-testid={dataTestids.root}>
      <UnitBoard unitBlock={unitBlock} unitSize={unitSize} onUnitClick={handleUnitClick} />
    </div>
  );
}

export default UnitPatternEditor;
export { dataTestids };
