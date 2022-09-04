import { memo } from 'react';
import range from 'lodash/range';

import { generateKeyFromIndex } from '@/utils/component';
import UnitSquare from '@/components/squares/UnitSquare';

type Props = {
  width: number;
  height: number;
  squareSize: number;
};

function BlurredUnitMap({ width, height, squareSize }: Props) {
  return (
    <section style={{ width: '100%', height: '100%', display: 'flex' }}>
      {range(width).map((colIdx) => (
        <section
          key={generateKeyFromIndex(colIdx)}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {range(height).map((rowIdx) => (
            <section
              key={generateKeyFromIndex(rowIdx)}
              style={{
                width: '100%',
                flexBasis: squareSize,
                flexShrink: 0,
              }}
            >
              <UnitSquare
                alive={false}
                highlighted={false}
                hasTopBorder
                hasRightBorder={colIdx === width - 1}
                hasBottomBorder={rowIdx === height - 1}
                hasLeftBorder
              />
            </section>
          ))}
        </section>
      ))}
    </section>
  );
}

export default memo(BlurredUnitMap);
