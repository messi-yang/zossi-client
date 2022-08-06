import { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { CoordinateEntity } from '@/entities';
import { generateKeyFromIndex } from '@/utils/component/';
import UnitSquare from '@/components/squares/UnitSquare';
import dataTestids from './dataTestids';

type Pattern = boolean[][];

type Props = {
  width: number;
  height: number;
  relativeCoordinates: CoordinateEntity[];
  relativeCoordinateOffset: CoordinateEntity;
  onUpdate: (coordinates: CoordinateEntity[]) => any;
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
  coordinates: CoordinateEntity[],
  coordinateOffset: CoordinateEntity,
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

function RelativeCoordinatesEditor({ relativeCoordinates, relativeCoordinateOffset, width, height, onUpdate }: Props) {
  const [pattern, setPattern] = useState<Pattern>(
    convertCoordinatesToPattern(relativeCoordinates, relativeCoordinateOffset, width, height)
  );

  useEffect(() => {
    setPattern(convertCoordinatesToPattern(relativeCoordinates, relativeCoordinateOffset, width, height));
  }, [relativeCoordinates, relativeCoordinateOffset, width, height]);

  const handleSquareClick = (colIdx: number, rowIdx: number) => {
    const newPattern = cloneDeep(pattern);
    newPattern[colIdx][rowIdx] = !newPattern[colIdx][rowIdx];

    const newCoordinates: CoordinateEntity[] = [];
    newPattern.forEach((row, x) => {
      row.forEach((isTurnedOn, y) => {
        if (isTurnedOn) {
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
    <div data-testid={dataTestids.root} style={{ display: 'flex', flexFlow: 'row' }}>
      {pattern.map((colInPattern, colIdx) => (
        <div
          key={generateKeyFromIndex(colIdx)}
          style={{
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {colInPattern.map((isTurnedOn, rowIdx) => (
            <div
              key={generateKeyFromIndex(rowIdx)}
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <UnitSquare
                alive={isTurnedOn}
                highlighted={false}
                hasTopBorder
                hasRightBorder={colIdx === pattern.length - 1}
                hasBottomBorder={rowIdx === colInPattern.length - 1}
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

export default RelativeCoordinatesEditor;
export { dataTestids };
