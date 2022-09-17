import { useRef } from 'react';
import { MapSizeVo, AreaVo, CoordinateVo } from '@/valueObjects';
import usePull from '@/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: MapSizeVo;
  area: AreaVo;
  onAreaUpdate: (newArea: AreaVo) => void;
};

function GameMiniMap({ width, mapSize, area, onAreaUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.height / mapSize.width;
  const areaWidth = area.to.getX() - area.from.getX() + 1;
  const areaHeight = area.to.getY() - area.from.getY() + 1;
  const mapZoomedAreaWidthRatio = areaWidth / mapSize.width;
  const mapZoomedAreaHeightRatio = areaHeight / mapSize.height;
  const offsetXRatio = area.from.getX() / mapSize.width;
  const offsetYRatio = area.from.getY() / mapSize.height;

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const areaElemWidth = elemWidth * mapZoomedAreaWidthRatio;
  const areaElemHeight = elemHeight * mapZoomedAreaHeightRatio;

  const calculateNewAreaFromMouseEvent = (clientX: number, clientY: number): AreaVo => {
    if (!mapContentElemRef.current) {
      return area;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - areaElemWidth / 2) / elemWidth) * mapSize.width);
    const standarizedY = Math.round(((elemY - areaElemHeight / 2) / elemHeight) * mapSize.height);
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + areaWidth - 1 > mapSize.width - 1) {
      adjustedX = mapSize.width - areaWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + areaHeight - 1 > mapSize.height - 1) {
      adjustedY = mapSize.height - areaHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return {
      from: new CoordinateVo(adjustedX, adjustedY),
      to: new CoordinateVo(adjustedX + areaWidth - 1, adjustedY + areaHeight - 1),
    };
  };

  usePull(mapContentElemRef, {
    onPullStart: (x, y) => {
      const newArea = calculateNewAreaFromMouseEvent(x, y);
      onAreaUpdate(newArea);
    },
    onPull: (x, y) => {
      const newArea = calculateNewAreaFromMouseEvent(x, y);
      onAreaUpdate(newArea);
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
          className="absolute box-border border border-solid"
          style={{
            left: `${offsetXRatio * 100}%`,
            top: `${offsetYRatio * 100}%`,
            borderColor: '#01D6C9',
            width: areaElemWidth,
            height: areaElemHeight,
          }}
        />
      </div>
    </div>
  );
}

export default GameMiniMap;
export { dataTestids };
