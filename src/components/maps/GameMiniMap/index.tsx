import { useRef } from 'react';
import { SizeVo, BoundVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  width: number;
  mapSize: SizeVo;
  bound: BoundVo;
};

function GameMiniMap({ width, mapSize, bound }: Props) {
  const mapContentElemRef = useRef<HTMLDivElement>(null);
  const mapSizeRatio = mapSize.getRatio();
  const mapSizeBoundSizeWidthRatio = bound.getSize().getWidth() / mapSize.getWidth();
  const mapSizeBoundSizeHeightRatio = bound.getSize().getHeight() / mapSize.getHeight();
  const offsetXRatio = bound.getFrom().getX() / mapSize.getWidth();
  const offsetYRatio = bound.getFrom().getY() / mapSize.getHeight();

  const elemWidth = width;
  const elemHeight = elemWidth * mapSizeRatio;
  const boundElemWidth = elemWidth * mapSizeBoundSizeWidthRatio;
  const boundElemHeight = elemHeight * mapSizeBoundSizeHeightRatio;

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
