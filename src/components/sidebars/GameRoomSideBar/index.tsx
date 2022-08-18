import { useState, useEffect } from 'react';
import range from 'lodash/range';
import { CoordinateVO } from '@/valueObjects';
import SmallLogo from '@/components/logos/SmallLogo/';
import LiveUnitMapIcon from '@/components/icons/LiveUnitMapIcon/';
import EditLiveUnitMapModal from '@/components/modals/EditLiveUnitMapModal/';
import type { LiveUnitMapVO } from '@/valueObjects';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

function convertRelativeCoordinatesToLiveUnitMap(
  relativeCoordinates: CoordinateVO[],
  coordinateOffset: CoordinateVO,
  boardWidth: number,
  boardHeight: number
): LiveUnitMapVO {
  const liveUnitMap: LiveUnitMapVO = [];
  range(0, boardWidth).forEach((colIdx) => {
    liveUnitMap.push([]);
    range(0, boardHeight).forEach(() => {
      liveUnitMap[colIdx].push(null);
    });
  });

  relativeCoordinates.forEach((relativeCoordinate) => {
    const colIdx = relativeCoordinate.x - coordinateOffset.x;
    const rowIdx = relativeCoordinate.y - coordinateOffset.y;
    if (liveUnitMap?.[colIdx]?.[rowIdx] !== undefined) {
      liveUnitMap[colIdx][rowIdx] = true;
    }
  });

  return liveUnitMap;
}

function convertLiveUnitMapToRelativeCoordinates(
  liveUnitMap: LiveUnitMapVO,
  coordinateOffset: CoordinateVO
): CoordinateVO[] {
  const coordinates: CoordinateVO[] = [];

  liveUnitMap.forEach((colInLiveUnitMap, colIdx) => {
    colInLiveUnitMap.forEach((isTruthy, rowIdx) => {
      if (isTruthy) {
        coordinates.push({
          x: colIdx + coordinateOffset.x,
          y: rowIdx + coordinateOffset.y,
        });
      }
    });
  });

  return coordinates;
}

type HoverStateFlags = {
  unitMap: boolean;
};

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  relativeCoordinates: CoordinateVO[];
  onRelativeCoordinatesUpdate: (coordinates: CoordinateVO[]) => void;
};

function GameRoomSideBar({ align, onLogoClick, relativeCoordinates, onRelativeCoordinatesUpdate }: Props) {
  const [coordinateOffset] = useState<CoordinateVO>({ x: -2, y: -2 });
  const [boardWidth, boardHeight] = [5, 5];
  const [hoverStateFlags, setHoverStateFlags] = useState<HoverStateFlags>({
    unitMap: false,
  });

  function handleHoverStateChange(key: 'unitMap', hovered: boolean) {
    const newFlags = { ...hoverStateFlags };
    newFlags[key] = hovered;
    setHoverStateFlags(newFlags);
  }

  const [isLiveUnitMapVisible, setIsLiveUnitMapVisible] = useState<boolean>(false);
  const handleLiveUnitMapItemClick = () => {
    setIsLiveUnitMapVisible(true);
  };
  const handleLiveUnitMapCancel = () => {
    setIsLiveUnitMapVisible(false);
  };
  const handleLiveUnitMapUpdate = (liveUnitMap: LiveUnitMapVO) => {
    const newRelativeCoordinates = convertLiveUnitMapToRelativeCoordinates(liveUnitMap, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsLiveUnitMapVisible(false);
  };

  const [liveUnitMap, setLiveUnitMap] = useState<LiveUnitMapVO>([]);
  useEffect(() => {
    const newLiveUnitMap = convertRelativeCoordinatesToLiveUnitMap(
      relativeCoordinates,
      coordinateOffset,
      boardWidth,
      boardHeight
    );
    setLiveUnitMap(newLiveUnitMap);
  }, [relativeCoordinates, coordinateOffset, boardWidth, boardHeight]);

  return (
    <section
      data-testid={dataTestids.root}
      style={{
        width: align === 'column' ? '90px' : '100%',
        height: align === 'row' ? '90px' : '100%',
        display: 'flex',
        flexFlow: align,
        backgroundColor: '#1C1C1C',
      }}
    >
      <ItemWrapper hovered={false} onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        hovered={hoverStateFlags.unitMap}
        onHoverStateChange={(hovered) => {
          handleHoverStateChange('unitMap', hovered);
        }}
        onClick={handleLiveUnitMapItemClick}
      >
        <LiveUnitMapIcon highlighted={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
      <EditLiveUnitMapModal
        opened={isLiveUnitMapVisible}
        liveUnitMap={liveUnitMap}
        onUpdate={handleLiveUnitMapUpdate}
        onCancel={handleLiveUnitMapCancel}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
