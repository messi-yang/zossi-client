import { useState, useCallback, memo } from 'react';
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
  relatCoordsForRevival: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

const UnitBoxMemo = memo(UnitBox);

function getRelativeCoordinate(
  originCoord: Coordinate,
  relativeCoord: Coordinate
): Coordinate {
  return {
    x: originCoord.x + relativeCoord.x,
    y: originCoord.y + relativeCoord.y,
  };
}

function isCoordInRelatCoordsForRevival(
  coord: Coordinate,
  originCoord: Coordinate,
  relatCoords: Coordinate[]
): boolean {
  let isUnitToBeRevived = false;
  for (let i = 0; i < relatCoords.length; i += 1) {
    const targetCoordiante = getRelativeCoordinate(originCoord, relatCoords[i]);
    if (coord.x === targetCoordiante.x && coord.y === targetCoordiante.y) {
      isUnitToBeRevived = true;
      break;
    }
  }
  return isUnitToBeRevived;
}

function GameOfLifeMap({ units, relatCoordsForRevival, onUnitsRevive }: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitBoxClick = useCallback(
    (coordinate: Coordinate) => {
      const coordinatesToRevive = relatCoordsForRevival.map((relatCoord) =>
        getRelativeCoordinate(coordinate, relatCoord)
      );

      onUnitsRevive(coordinatesToRevive);
    },
    [relatCoordsForRevival]
  );
  const onUnitBoxHover = useCallback((coordinate: Coordinate) => {
    setHoveredCoordinate(coordinate);
  }, []);
  function isUnitToBeRevived(coordinate: Coordinate): boolean {
    if (!hoveredCoordinate || !relatCoordsForRevival) {
      return false;
    }

    return isCoordInRelatCoordsForRevival(
      coordinate,
      hoveredCoordinate,
      relatCoordsForRevival
    );
  }

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
                <UnitBoxMemo
                  key={`${unit.coordinate.x},${unit.coordinate.y}`}
                  unit={unit}
                  toBeRevived={isUnitToBeRevived(unit.coordinate)}
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
