import { useCallback, useRef } from 'react';
import { DimensionVo, BoundVo, LocationVo } from '@/models/valueObjects';
import usePull from '@/hooks/usePull';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  dimension: DimensionVo;
  bound: BoundVo;
  onDrag: (center: LocationVo) => void;
};

function GameMiniMap({ width, dimension, bound, onDrag }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const dimensionRatio = dimension.getRatio();
  const mapDimensionBoundDimensionWidthRatio = bound.getDimension().getWidth() / dimension.getWidth();
  const mapDimensionBoundDimensionHeightRatio = bound.getDimension().getHeight() / dimension.getHeight();
  const offsetXRatio = bound.getFrom().getX() / dimension.getWidth();
  const offsetYRatio = bound.getFrom().getY() / dimension.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * dimensionRatio;
  const boundElemWidth = elemWidth * mapDimensionBoundDimensionWidthRatio;
  const boundElemHeight = elemHeight * mapDimensionBoundDimensionHeightRatio;

  const calculateLocation = useCallback(
    (clientX: number, clientY: number): LocationVo | null => {
      if (!mapContentElemRef.current) {
        return null;
      }
      const rect = mapContentElemRef.current.getBoundingClientRect();
      const elemX = clientX - rect.left;
      const elemY = clientY - rect.top;
      let standarizedX = Math.round((elemX / elemWidth) * dimension.getWidth());
      standarizedX = standarizedX < 0 ? 0 : standarizedX;
      standarizedX = standarizedX > dimension.getWidth() - 1 ? dimension.getWidth() - 1 : standarizedX;
      let standarizedY = Math.round((elemY / elemHeight) * dimension.getHeight());
      standarizedY = standarizedY > 0 ? standarizedY : 0;
      standarizedY = standarizedY > dimension.getWidth() - 1 ? dimension.getWidth() - 1 : standarizedY;
      return LocationVo.new(standarizedX, standarizedY);
    },
    [mapContentElemRef.current]
  );

  const handlePull = useCallback(
    (clientX: number, clientY: number) => {
      const locationOnMap = calculateLocation(clientX, clientY);
      if (locationOnMap) {
        onDrag(locationOnMap);
      }
    },
    [calculateLocation]
  );

  usePull(mapContentElemRef, {
    onPullStart: handlePull,
    onPull: handlePull,
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
            width: boundElemWidth,
            height: boundElemHeight,
          }}
        />
      </div>
    </div>
  );
}

export default GameMiniMap;
export { dataTestids };
