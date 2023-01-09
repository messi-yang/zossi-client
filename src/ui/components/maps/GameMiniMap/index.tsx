import { useRef } from 'react';
import { DimensionVo, RangeVo, LocationVo } from '@/models/valueObjects';
import usePull from '@/ui/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  dimension: DimensionVo;
  range: RangeVo;
  onRangeUpdate: (newRange: RangeVo) => void;
};

function GameMiniMap({ width, dimension, range, onRangeUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const dimensionRatio = dimension.getRatio();
  const rangeWidth = range.getWidth();
  const rangeHeight = range.getHeight();
  const mapObservedRangeWidthRatio = rangeWidth / dimension.getWidth();
  const mapObservedRangeHeightRatio = rangeHeight / dimension.getHeight();
  const offsetXRatio = range.getFrom().getX() / dimension.getWidth();
  const offsetYRatio = range.getFrom().getY() / dimension.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * dimensionRatio;
  const rangeElemWidth = elemWidth * mapObservedRangeWidthRatio;
  const rangeElemHeight = elemHeight * mapObservedRangeHeightRatio;

  const calculateNewRangeFromMouseEvent = (clientX: number, clientY: number): RangeVo => {
    if (!mapContentElemRef.current) {
      return range;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - rangeElemWidth / 2) / elemWidth) * dimension.getWidth());
    const standarizedY = Math.round(((elemY - rangeElemHeight / 2) / elemHeight) * dimension.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + rangeWidth - 1 > dimension.getWidth() - 1) {
      adjustedX = dimension.getWidth() - rangeWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + rangeHeight - 1 > dimension.getHeight() - 1) {
      adjustedY = dimension.getHeight() - rangeHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return RangeVo.new(
      LocationVo.new(adjustedX, adjustedY),
      LocationVo.new(adjustedX + rangeWidth - 1, adjustedY + rangeHeight - 1)
    );
  };

  usePull(mapContentElemRef, {
    onPullStart: (x, y) => {
      const newRange = calculateNewRangeFromMouseEvent(x, y);
      onRangeUpdate(newRange);
    },
    onPull: (x, y) => {
      const newRange = calculateNewRangeFromMouseEvent(x, y);
      onRangeUpdate(newRange);
    },
  });

  return (
    <div data-testid={dataTestids.root} className="inline-flex border-4 border-solid border-white">
      <div
        ref={mapContentElemRef}
        className="relative inline-flex bg-black cursor-grab touch-none"
        style={{
          width: elemWidth,
          height: elemHeight,
        }}
        role="button"
        tabIndex={0}
      >
        <section
          className="absolute box-border border border-solid border-[#01D6C9]"
          style={{
            left: `${offsetXRatio * 100}%`,
            top: `${offsetYRatio * 100}%`,
            width: rangeElemWidth,
            height: rangeElemHeight,
          }}
        />
      </div>
    </div>
  );
}

export default GameMiniMap;
export { dataTestids };
