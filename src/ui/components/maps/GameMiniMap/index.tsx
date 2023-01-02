import { useRef } from 'react';
import { MapSizeVo, MapRangeVo, LocationVo } from '@/models/valueObjects';
import usePull from '@/ui/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: MapSizeVo;
  mapRange: MapRangeVo;
  onMapRangeUpdate: (newMapRange: MapRangeVo) => void;
};

function GameMiniMap({ width, mapSize, mapRange, onMapRangeUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.getRatio();
  const mapRangeWidth = mapRange.getWidth();
  const mapRangeHeight = mapRange.getHeight();
  const mapZoomedMapRangeWidthRatio = mapRangeWidth / mapSize.getWidth();
  const mapZoomedMapRangeHeightRatio = mapRangeHeight / mapSize.getHeight();
  const offsetXRatio = mapRange.getFrom().getX() / mapSize.getWidth();
  const offsetYRatio = mapRange.getFrom().getY() / mapSize.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const mapRangeElemWidth = elemWidth * mapZoomedMapRangeWidthRatio;
  const mapRangeElemHeight = elemHeight * mapZoomedMapRangeHeightRatio;

  const calculateNewMapRangeFromMouseEvent = (clientX: number, clientY: number): MapRangeVo => {
    if (!mapContentElemRef.current) {
      return mapRange;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - mapRangeElemWidth / 2) / elemWidth) * mapSize.getWidth());
    const standarizedY = Math.round(((elemY - mapRangeElemHeight / 2) / elemHeight) * mapSize.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + mapRangeWidth - 1 > mapSize.getWidth() - 1) {
      adjustedX = mapSize.getWidth() - mapRangeWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + mapRangeHeight - 1 > mapSize.getHeight() - 1) {
      adjustedY = mapSize.getHeight() - mapRangeHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return MapRangeVo.new(
      LocationVo.new(adjustedX, adjustedY),
      LocationVo.new(adjustedX + mapRangeWidth - 1, adjustedY + mapRangeHeight - 1)
    );
  };

  usePull(mapContentElemRef, {
    onPullStart: (x, y) => {
      const newMapRange = calculateNewMapRangeFromMouseEvent(x, y);
      onMapRangeUpdate(newMapRange);
    },
    onPull: (x, y) => {
      const newMapRange = calculateNewMapRangeFromMouseEvent(x, y);
      onMapRangeUpdate(newMapRange);
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
            width: mapRangeElemWidth,
            height: mapRangeElemHeight,
          }}
        />
      </div>
    </div>
  );
}

export default GameMiniMap;
export { dataTestids };
