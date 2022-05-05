import { useCallback } from 'react';
import { Units } from './types';
import UnitBox from './UnitBox';

type WrapperProps = {
  children: JSX.Element;
};

function Wrapper({ children }: WrapperProps) {
  return (
    <section style={{ width: '100%', height: '100%', display: 'flex' }}>
      {children}
    </section>
  );
}

type UnitBoxesProps = {
  children: JSX.Element;
};

function UnitBoxes({ children }: UnitBoxesProps) {
  return (
    <section
      style={{
        flexGrow: '1',
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      {children}
    </section>
  );
}

type Props = {
  units: Units;
};

function GameOfLifeMap({ units }: Props) {
  const onUnitBoxClick = useCallback(() => {
    // console.log(coord);
  }, []);

  return (
    <Wrapper>
      <>
        {units.map((unitsRow) => (
          <UnitBoxes key={unitsRow[0].coordinate.x}>
            <>
              {unitsRow.map((unit) => (
                <UnitBox
                  key={`${unit.coordinate.x},${unit.coordinate.y}`}
                  unit={unit}
                  onClick={onUnitBoxClick}
                />
              ))}
            </>
          </UnitBoxes>
        ))}
      </>
    </Wrapper>
  );
}

export default GameOfLifeMap;
export type { Units };
