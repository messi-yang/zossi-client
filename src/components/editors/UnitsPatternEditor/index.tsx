import cloneDeep from 'lodash/cloneDeep';
import UnitSquare from '@/components/squares/UnitSquare';

type Props = {
  pattern: boolean[][];
  onUpdate: (newPattern: boolean[][]) => any;
};

export default function UnitsPatternEditor({ pattern, onUpdate }: Props) {
  const onUnitClick = (coordinateX: number, coordinateY: number) => {
    const newPattern = cloneDeep(pattern);
    newPattern[coordinateX][coordinateY] =
      !newPattern[coordinateX][coordinateY];
    onUpdate(newPattern);
  };

  return (
    <div style={{ display: 'flex', flexFlow: 'row' }}>
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
