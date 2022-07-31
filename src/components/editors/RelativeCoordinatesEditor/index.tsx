import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import UnitSquare from '@/components/squares/UnitSquare';
import dataTestids from './dataTestids';

type Pattern = boolean[][];
export type Coordinate = {
  x: number;
  y: number;
};

type Props = {
  width: number;
  height: number;
  relativeCoordinates: Coordinate[];
  relativeCoordinateOffset: Coordinate;
  onUpdate: (coordinates: Coordinate[]) => any;
};

function createInitialPattern(width: number, height: number): Pattern {
  const pattern: Pattern = [];
  for (let i = 0; i < width; i += 1) {
    pattern.push([]);
    for (let j = 0; j < height; j += 1) {
      pattern[i].push(false);
    }
  }
  return pattern;
}

function convertCoordinatesToPattern(
  coordinates: Coordinate[],
  coordinateOffset: Coordinate,
  width: number,
  height: number
): Pattern {
  const newPattern: Pattern = createInitialPattern(width, height);
  coordinates.forEach(({ x, y }) => {
    const adjustedX = x - coordinateOffset.x;
    const adjustedY = y - coordinateOffset.y;
    if (newPattern?.[adjustedX]?.[adjustedY] !== undefined) {
      newPattern[adjustedX][adjustedY] = true;
    }
  });

  return newPattern;
}

function RelativeCoordinatesEditor({
  relativeCoordinates,
  relativeCoordinateOffset,
  width,
  height,
  onUpdate,
}: Props) {
  const [pattern, setPattern] = useState<Pattern>(
    convertCoordinatesToPattern(
      relativeCoordinates,
      relativeCoordinateOffset,
      width,
      height
    )
  );
  useEffect(() => {
    setPattern(
      convertCoordinatesToPattern(
        relativeCoordinates,
        relativeCoordinateOffset,
        width,
        height
      )
    );
  }, [relativeCoordinates, relativeCoordinateOffset, width, height]);
  const onUnitClick = (coordinateX: number, coordinateY: number) => {
    const newPattern = cloneDeep(pattern);
    newPattern[coordinateX][coordinateY] =
      !newPattern[coordinateX][coordinateY];

    const newCoordinates: Coordinate[] = [];
    newPattern.forEach((row, x) => {
      row.forEach((truthy, y) => {
        if (truthy) {
          newCoordinates.push({
            x: x + relativeCoordinateOffset.x,
            y: y + relativeCoordinateOffset.y,
          });
        }
      });
    });
    onUpdate(newCoordinates);
  };

  return (
    <div
      data-testid={dataTestids.root}
      style={{ display: 'flex', flexFlow: 'row' }}
    >
      {pattern.map((rowInPattern, x) => (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {rowInPattern.map((truthy, y) => (
            <div
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <UnitSquare
                coordinateX={x}
                coordinateY={y}
                alive={truthy}
                highlighted={false}
                hasTopBorder
                hasRightBorder={x === pattern.length - 1}
                hasBottomBorder={y === rowInPattern.length - 1}
                hasLeftBorder
                onClick={onUnitClick}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RelativeCoordinatesEditor;
export { dataTestids };
