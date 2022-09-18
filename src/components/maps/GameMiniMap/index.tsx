import { useRef } from 'react';
import { MapSizeVO, AreaVO, CoordinateVO } from '@/valueObjects';
import usePull from '@/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: MapSizeVO;
  area: AreaVO;
  onAreaUpdate: (newArea: AreaVO) => void;
};

function GameMiniMap({ width, mapSize, area, onAreaUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.getRatio();
  const areaWidth = area.getWidth();
  const areaHeight = area.getHeight();
  const mapZoomedAreaWidthRatio = areaWidth / mapSize.getWidth();
  const mapZoomedAreaHeightRatio = areaHeight / mapSize.getHeight();
  const offsetXRatio = area.getFrom().getX() / mapSize.getWidth();
  const offsetYRatio = area.getFrom().getY() / mapSize.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const areaElemWidth = elemWidth * mapZoomedAreaWidthRatio;
  const areaElemHeight = elemHeight * mapZoomedAreaHeightRatio;

  const calculateNewAreaFromMouseEvent = (clientX: number, clientY: number): AreaVO => {
    if (!mapContentElemRef.current) {
      return area;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - areaElemWidth / 2) / elemWidth) * mapSize.getWidth());
    const standarizedY = Math.round(((elemY - areaElemHeight / 2) / elemHeight) * mapSize.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + areaWidth - 1 > mapSize.getWidth() - 1) {
      adjustedX = mapSize.getWidth() - areaWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + areaHeight - 1 > mapSize.getHeight() - 1) {
      adjustedY = mapSize.getHeight() - areaHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return new AreaVO(
      new CoordinateVO(adjustedX, adjustedY),
      new CoordinateVO(adjustedX + areaWidth - 1, adjustedY + areaHeight - 1)
    );
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
