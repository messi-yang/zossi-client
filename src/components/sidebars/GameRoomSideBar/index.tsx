import { useState, useEffect } from 'react';
import range from 'lodash/range';
import { CoordinateEntity } from '@/entities';
import SmallLogo from '@/components/logos/SmallLogo/';
import LiveUnitMapIcon from '@/components/icons/LiveUnitMapIcon/';
import EditLiveUnitMapModal from '@/components/modals/EditLiveUnitMapModal/';
import type { LiveUnitMapEntity } from '@/entities/';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

function convertRelativeCoordinatesToLiveUnitMap(
  relativeCoordinates: CoordinateEntity[],
  coordinateOffset: CoordinateEntity,
  boardWidth: number,
  boardHeight: number
): LiveUnitMapEntity {
  const liveUnitMap: LiveUnitMapEntity = [];
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
  liveUnitMap: LiveUnitMapEntity,
  coordinateOffset: CoordinateEntity
): CoordinateEntity[] {
  const coordinates: CoordinateEntity[] = [];

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
  onLogoClick: () => void;
  relativeCoordinates: CoordinateEntity[];
  onRelativeCoordinatesUpdate: (coordinates: CoordinateEntity[]) => void;
};

function GameRoomSideBar({ onLogoClick, relativeCoordinates, onRelativeCoordinatesUpdate }: Props) {
  const [coordinateOffset] = useState<CoordinateEntity>({ x: -2, y: -2 });
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
  const handleLiveUnitMapUpdate = (liveUnitMap: LiveUnitMapEntity) => {
    const newRelativeCoordinates = convertLiveUnitMapToRelativeCoordinates(liveUnitMap, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsLiveUnitMapVisible(false);
  };

  const [liveUnitMap, setLiveUnitMap] = useState<LiveUnitMapEntity>([]);
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
        width: '90px',
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        backgroundColor: '#1C1C1C',
      }}
    >
      <ItemWrapper hovered={false} width="100%" height="70px" onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        width="100%"
        height="70px"
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
