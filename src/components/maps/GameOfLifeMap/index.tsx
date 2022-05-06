import { Units, Coordinate } from './types';
import UnitBox from './UnitBox';
import styles from './styles';

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
  hasBorder: boolean;
};

function UnitBoxes({ children, hasBorder }: UnitBoxesProps) {
  return (
    <section
      style={{
        flexGrow: '1',
        display: 'flex',
        flexFlow: 'column',
        borderRight: hasBorder ? `1px solid ${styles.unitBoxBorderColor}` : '',
      }}
    >
      {children}
    </section>
  );
}

type Props = {
  units: Units;
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

function GameOfLifeMap({ units, onUnitsRevive }: Props) {
  const onUnitBoxClick = (coordinate: Coordinate) =>
    onUnitsRevive([coordinate]);
  const onUnitBoxHover = () => {
    // console.log(coordinate);
  };

  return (
    <Wrapper>
      <>
        {units.map((unitsRow, unitsRowIndex) => (
          <UnitBoxes
            key={unitsRow[0].coordinate.x}
            hasBorder={unitsRowIndex !== units.length - 1}
          >
            <>
              {unitsRow.map((unit, unitIndex) => (
                <UnitBox
                  key={`${unit.coordinate.x},${unit.coordinate.y}`}
                  unit={unit}
                  hasBorder={unitIndex !== unitsRow.length - 1}
                  onClick={onUnitBoxClick}
                  onHover={onUnitBoxHover}
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
export type { Units, Coordinate };
