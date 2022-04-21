import { useCallback } from 'react';
import Block from '../Block';
import { Units } from '../types';

type Props = {
  units: Units;
};

function Field({ units }: Props) {
  const onBlockClick = useCallback(() => {}, []);

  return (
    <section style={{ display: 'inline-flex' }}>
      {units.map((unitsRow) => (
        <section
          key={unitsRow[0].coordinate.x}
          style={{ display: 'flex', flexFlow: 'column' }}
        >
          {unitsRow.map((unit) => (
            <Block
              key={`${unit.coordinate.x},${unit.coordinate.y}`}
              unit={unit}
              onClick={onBlockClick}
            />
          ))}
        </section>
      ))}
    </section>
  );
}

export default Field;
