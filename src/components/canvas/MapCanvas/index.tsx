import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

import { UnitVo, MapVo, SizeVo } from '@/models/valueObjects';

import { ItemAgg } from '@/models/aggregates';
import dataTestids from './dataTestids';

const color = {
  unitColor: 'white',
  destroyWarningColor: 'rgb(237, 28, 37)',
};

type Indexes = [colIdx: number, rowIdx: number];

type ElemSize = {
  width: number;
  height: number;
};

type Resolution = {
  width: number;
  height: number;
};

type ItemMap = {
  [id: string]: ItemAgg;
};

function generateCanvasElemSize(map: MapVo, unitSize: number): ElemSize {
  const size = map.getSize();

  return {
    width: size.getWidth() * unitSize + 1,
    height: size.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(map: MapVo, unitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(map, unitSize);

  return {
    width: elemSize.width,
    height: elemSize.height,
  };
}

type Props = {
  map: MapVo;
  unitSize: number;
  items: ItemAgg[];
  selectedItemId: string | null;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function MapCanvas({ map, unitSize, items, selectedItemId, onClick }: Props) {
  const [mapCanvasElem, setMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [grassBaseImageElem, setGrassBaseImageElem] = useState<HTMLImageElement | null>(null);
  useEffect(function loadGrassBaseImageElemEffect() {
    const image = new Image();
    image.onload = () => {
      setGrassBaseImageElem(image);
    };
    image.src = '/grass-base.png';
  }, []);

  const [size, setSize] = useState(map.getSize());

  const itemMap: ItemMap = useMemo(() => {
    const res: ItemMap = {};
    items.forEach((item) => {
      res[item.getId()] = item;
    });
    return res;
  }, [items]);

  const canvasResolution = useMemo(() => generateCanvasResolution(map, unitSize), [map, unitSize]);
  const canvasElemSize = useMemo(() => generateCanvasElemSize(map, unitSize), [map, unitSize]);

  const getItemAssetImageElemOfUnit = useCallback(
    (unit: UnitVo): HTMLImageElement | null => {
      const itemId = unit.getItemId();
      const item = itemId ? itemMap[itemId] : null;
      return item?.outputAssetAsImageElement() || null;
    },
    [itemMap]
  );

  const getItemAssetImageElemOfItem = useCallback(
    (itemId: string): HTMLImageElement | null => {
      const item = itemId ? itemMap[itemId] : null;
      return item?.outputAssetAsImageElement() || null;
    },
    [itemMap]
  );

  useEffect(() => {
    const newSize = map.getSize();
    if (!size.isEqual(newSize)) {
      setSize(newSize);
    }
  }, [map]);

  const clean = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasResolution.width, canvasResolution.height);
    },
    [canvasResolution]
  );

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D, newMap: MapVo, newUnitSize: number) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newMap.iterateUnit((colIdx: number, rowIdx: number, unit: UnitVo) => {
        const leftTopX = colIdx * newUnitSize;
        const leftTopY = rowIdx * newUnitSize;

        const itemAssetImageElem = getItemAssetImageElemOfUnit(unit);
        if (grassBaseImageElem) {
          ctx.drawImage(grassBaseImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
          if (itemAssetImageElem) {
            ctx.drawImage(itemAssetImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
          }
        }
      });
      ctx.fill();
    },
    [getItemAssetImageElemOfUnit, grassBaseImageElem]
  );

  const draw = useCallback(
    (newMap: MapVo, newUnitSize: number) => {
      const ctx = mapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawUnits(ctx, newMap, newUnitSize);
    },
    [drawUnits, mapCanvasElem, map, unitSize, size]
  );

  draw(map, unitSize);

  const onMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newSize: SizeVo): Indexes => {
      let colIdx = Math.floor(relativeX / newUnitSize);
      let rowIdx = Math.floor(relativeY / newUnitSize);
      if (colIdx >= newSize.getWidth()) {
        colIdx = newSize.getWidth() - 1;
      }
      if (rowIdx >= newSize.getHeight()) {
        rowIdx = newSize.getHeight() - 1;
      }

      return [colIdx, rowIdx];
    },
    []
  );

  const drawHoverMask = useCallback(
    (ctx: CanvasRenderingContext2D, newHoveredIndexes: Indexes, newUnitSize: number) => {
      const itemAssetImageElem = selectedItemId ? getItemAssetImageElemOfItem(selectedItemId) : null;

      const leftTopY = newHoveredIndexes[1] * newUnitSize;
      const leftTopX = newHoveredIndexes[0] * newUnitSize;

      ctx.globalAlpha = 0.4; // eslint-disable-line no-param-reassign
      if (itemAssetImageElem) {
        ctx.drawImage(itemAssetImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
      } else {
        ctx.fillStyle = color.destroyWarningColor; // eslint-disable-line no-param-reassign
        ctx.beginPath();
        ctx.moveTo(leftTopX, leftTopY);
        ctx.lineTo(leftTopX + newUnitSize, leftTopY);
        ctx.lineTo(leftTopX + newUnitSize, leftTopY + newUnitSize);
        ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1));
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1; // eslint-disable-line no-param-reassign
    },
    [selectedItemId, getItemAssetImageElemOfItem]
  );

  const handleHoverMaskCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      const ctx = hoverMaskCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      const eventTarget = event.target as Element;
      const eventTargetRect = eventTarget.getBoundingClientRect();
      const [posX, posY] = [event.clientX - eventTargetRect.left, event.clientY - eventTargetRect.top];
      const newHoveredIndexes = calculateIndexes(posX, posY, unitSize, size);

      clean(ctx);
      drawHoverMask(ctx, newHoveredIndexes, unitSize);
    },
    [unitSize, size, hoverMaskCanvasElem, clean, drawHoverMask]
  );

  const handleHoverMaskCanvasMouseMoveDebouncer = useCallback(
    debounce(handleHoverMaskCanvasMouseMove, 75, { maxWait: 75 }),
    [handleHoverMaskCanvasMouseMove]
  );

  const handleHoverMaskCanvasMouseLeave = useCallback(() => {
    const ctx = hoverMaskCanvasElem?.getContext('2d');
    if (!ctx) {
      return;
    }

    handleHoverMaskCanvasMouseMoveDebouncer.cancel();
    clean(ctx);
  }, [hoverMaskCanvasElem, clean]);

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [event.clientX - eventTargetRect.left, event.clientY - eventTargetRect.top];
    const clickedIndexes = calculateIndexes(posX, posY, unitSize, size);
    onClick(clickedIndexes[0], clickedIndexes[1]);
  };

  const onHoverMaskCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    HoverMaskCanvasElem(elem);
  }, []);

  return (
    <div
      data-testid={dataTestids.root}
      style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      className="relative box-border"
    >
      <canvas
        ref={onMapCanvasLoad}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="absolute left-0 top-0 z-0"
        style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      />
      <canvas
        ref={onHoverMaskCanvasLoad}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="absolute left-0 top-0 cursor-pointer"
        onMouseMove={handleHoverMaskCanvasMouseMoveDebouncer}
        onMouseLeave={handleHoverMaskCanvasMouseLeave}
        onClick={handleHoverMaskCanvasClick}
        style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      />
    </div>
  );
}

export default MapCanvas;
export { dataTestids };
