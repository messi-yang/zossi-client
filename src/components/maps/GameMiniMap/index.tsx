import { MouseEvent, useRef, useState, useEffect, TouchEvent } from 'react';
import { MapSizeEntity, AreaEntity } from '@/entities';
import dataTestids from './dataTestids';

type Props = {
  mapSize: MapSizeEntity;
  area: AreaEntity;
  onAreaUpdate: (newArea: AreaEntity) => void;
};

function GameMiniMap({ mapSize, area, onAreaUpdate }: Props) {
  const [isMovable, setIsMovable] = useState<boolean>(false);
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.height / mapSize.width;
  const areaWidth = area.to.x - area.from.x + 1;
  const areaHeight = area.to.y - area.from.y + 1;
  const mapZoomedAreaWidthRatio = areaWidth / mapSize.width;
  const mapZoomedAreaHeightRatio = areaHeight / mapSize.height;
  const offsetXRatio = area.from.x / mapSize.width;
  const offsetYRatio = area.from.y / mapSize.height;

  const elemWidth = 100;
  const elemHeight = 100 * mapSizeRatio;
  const areaElemWidth = elemWidth * mapZoomedAreaWidthRatio;
  const areaElemHeight = elemHeight * mapZoomedAreaHeightRatio;

  const calculateNewAreaFromMouseEvent = (clientX: number, clientY: number): AreaEntity => {
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
      from: {
        x: adjustedX,
        y: adjustedY,
      },
      to: {
        x: adjustedX + areaWidth - 1,
        y: adjustedY + areaHeight - 1,
      },
    };
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    const newArea = calculateNewAreaFromMouseEvent(event.clientX, event.clientY);
    onAreaUpdate(newArea);
    setIsMovable(true);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const newArea = calculateNewAreaFromMouseEvent(event.touches[0].clientX, event.touches[0].clientY);
    onAreaUpdate(newArea);
    setIsMovable(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMovable(false);
    };
    const handleTouchEnd = () => {
      setIsMovable(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (!isMovable) {
        return;
      }
      const newArea = calculateNewAreaFromMouseEvent(event.clientX, event.clientY);
      onAreaUpdate(newArea);
    };
    const handleTouchMove = (event: globalThis.TouchEvent) => {
      if (!isMovable) {
        return;
      }
      const newArea = calculateNewAreaFromMouseEvent(event.touches[0].clientX, event.touches[0].clientY);
      onAreaUpdate(newArea);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMovable]);

  return (
    <div
      data-testid={dataTestids.root}
      style={{
        display: 'inline-flex',
        border: '4px solid white',
      }}
    >
      <div
        ref={mapContentElemRef}
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: elemWidth,
          height: elemHeight,
          background: 'black',
          cursor: 'grab',
        }}
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <section
          style={{
            position: 'absolute',
            left: `${offsetXRatio * 100}%`,
            top: `${offsetYRatio * 100}%`,
            boxSizing: 'border-box',
            border: '1px solid yellow',
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
