import { useRef } from 'react';
import { MapSizeVo, ExtentVo, LocationVo } from '@/models/valueObjects';
import usePull from '@/ui/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: MapSizeVo;
  extent: ExtentVo;
  onExtentUpdate: (newExtent: ExtentVo) => void;
};

function GameMiniMap({ width, mapSize, extent, onExtentUpdate }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.getRatio();
  const extentWidth = extent.getWidth();
  const extentHeight = extent.getHeight();
  const mapObservedExtentWidthRatio = extentWidth / mapSize.getWidth();
  const mapObservedExtentHeightRatio = extentHeight / mapSize.getHeight();
  const offsetXRatio = extent.getFrom().getX() / mapSize.getWidth();
  const offsetYRatio = extent.getFrom().getY() / mapSize.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const extentElemWidth = elemWidth * mapObservedExtentWidthRatio;
  const extentElemHeight = elemHeight * mapObservedExtentHeightRatio;

  const calculateNewExtentFromMouseEvent = (clientX: number, clientY: number): ExtentVo => {
    if (!mapContentElemRef.current) {
      return extent;
    }
    const rect = mapContentElemRef.current.getBoundingClientRect();
    const elemX = clientX - rect.left;
    const elemY = clientY - rect.top;
    const standarizedX = Math.round(((elemX - extentElemWidth / 2) / elemWidth) * mapSize.getWidth());
    const standarizedY = Math.round(((elemY - extentElemHeight / 2) / elemHeight) * mapSize.getHeight());
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + extentWidth - 1 > mapSize.getWidth() - 1) {
      adjustedX = mapSize.getWidth() - extentWidth;
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + extentHeight - 1 > mapSize.getHeight() - 1) {
      adjustedY = mapSize.getHeight() - extentHeight;
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return ExtentVo.new(
      LocationVo.new(adjustedX, adjustedY),
      LocationVo.new(adjustedX + extentWidth - 1, adjustedY + extentHeight - 1)
    );
  };

  usePull(mapContentElemRef, {
    onPullStart: (x, y) => {
      const newExtent = calculateNewExtentFromMouseEvent(x, y);
      onExtentUpdate(newExtent);
    },
    onPull: (x, y) => {
      const newExtent = calculateNewExtentFromMouseEvent(x, y);
      onExtentUpdate(newExtent);
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
            width: extentElemWidth,
            height: extentElemHeight,
          }}
        />
      </div>
    </div>
  );
}

export default GameMiniMap;
export { dataTestids };
