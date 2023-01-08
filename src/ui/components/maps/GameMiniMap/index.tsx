import { useRef } from 'react';
import { MapSizeVo, RangeVo, LocationVo } from '@/models/valueObjects';
import usePull from '@/ui/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: MapSizeVo;
  range: RangeVo;
  onRangeUpdate: (newRange: RangeVo) => void;
};

function GameMiniMap({ width, mapSize, range, onRangeUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.getRatio();
  const rangeWidth = range.getWidth();
  const rangeHeight = range.getHeight();
  const mapObservedRangeWidthRatio = rangeWidth / mapSize.getWidth();
  const mapObservedRangeHeightRatio = rangeHeight / mapSize.getHeight();
  const offsetXRatio = range.getFrom().getX() / mapSize.getWidth();
  const offsetYRatio = range.getFrom().getY() / mapSize.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const rangeElemWidth = elemWidth * mapObservedRangeWidthRatio;
  const rangeElemHeight = elemHeight * mapObservedRangeHeightRatio;

  const calculateNewRangeFromMouseEvent = (clientX: number, clientY: number): RangeVo => {
    if (!mapContentElemRef.current) {
      return range;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - rangeElemWidth / 2) / elemWidth) * mapSize.getWidth());
    const standarizedY = Math.round(((elemY - rangeElemHeight / 2) / elemHeight) * mapSize.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + rangeWidth - 1 > mapSize.getWidth() - 1) {
      adjustedX = mapSize.getWidth() - rangeWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + rangeHeight - 1 > mapSize.getHeight() - 1) {
      adjustedY = mapSize.getHeight() - rangeHeight;
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
