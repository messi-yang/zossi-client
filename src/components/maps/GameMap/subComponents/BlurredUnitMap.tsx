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
    <section className="w-full h-full flex">
      {range(width).map((colIdx) => (
        <section
          key={generateKeyFromIndex(colIdx)}
          className="shrink-0 flex flex-col"
          style={{
            flexBasis: squareSize,
          }}
        >
          {range(height).map((rowIdx) => (
            <section
              key={generateKeyFromIndex(rowIdx)}
              className="w-full shrink-0"
              style={{
                flexBasis: squareSize,
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
