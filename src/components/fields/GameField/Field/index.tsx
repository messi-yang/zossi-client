import { useCallback } from 'react';
import Block from '../Block';
import { Units } from '../types';

type Props = {
  units: Units;
  unitSize: number;
};

function Field({ units, unitSize }: Props) {
  const onBlockClick = useCallback(() => {}, []);

  return (
    <section style={{ display: 'flex' }}>
      {units.map((unitsRow) => (
        <section
          key={unitsRow[0].coordinate.x}
          style={{ display: 'flex', flexFlow: 'column' }}
        >
          {unitsRow.map((unit) => (
            <Block
              key={`${unit.coordinate.x},${unit.coordinate.y}`}
              unit={unit}
              size={unitSize}
              onClick={onBlockClick}
            />
          ))}
        </section>
      ))}
    </section>
  );
}

export default Field;
