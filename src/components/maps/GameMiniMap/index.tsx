import { useRef } from 'react';
import { DimensionValueObject, AreaValueObject } from '@/valueObjects';
import { createCoordinate, createArea } from '@/valueObjects/factories';
import usePull from '@/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  dimension: DimensionValueObject;
  area: AreaValueObject;
  onAreaUpdate: (newArea: AreaValueObject) => void;
};

function GameMiniMap({ width, dimension, area, onAreaUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const dimensionRatio = dimension.getRatio();
  const areaWidth = area.getWidth();
  const areaHeight = area.getHeight();
  const mapZoomedAreaWidthRatio = areaWidth / dimension.getWidth();
  const mapZoomedAreaHeightRatio = areaHeight / dimension.getHeight();
  const offsetXRatio = area.getFrom().getX() / dimension.getWidth();
  const offsetYRatio = area.getFrom().getY() / dimension.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * dimensionRatio;
  const areaElemWidth = elemWidth * mapZoomedAreaWidthRatio;
  const areaElemHeight = elemHeight * mapZoomedAreaHeightRatio;

  const calculateNewAreaFromMouseEvent = (clientX: number, clientY: number): AreaValueObject => {
    if (!mapContentElemRef.current) {
      return area;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - areaElemWidth / 2) / elemWidth) * dimension.getWidth());
    const standarizedY = Math.round(((elemY - areaElemHeight / 2) / elemHeight) * dimension.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + areaWidth - 1 > dimension.getWidth() - 1) {
      adjustedX = dimension.getWidth() - areaWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + areaHeight - 1 > dimension.getHeight() - 1) {
      adjustedY = dimension.getHeight() - areaHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return createArea(
      createCoordinate(adjustedX, adjustedY),
      createCoordinate(adjustedX + areaWidth - 1, adjustedY + areaHeight - 1)
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
