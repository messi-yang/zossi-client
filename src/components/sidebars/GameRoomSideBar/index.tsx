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
  relativeCoordinates: CoordinateVO[] | null,
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

  if (!relativeCoordinates) {
    return liveUnitMap;
  }

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
): CoordinateVO[] | null {
  const coordinates: CoordinateVO[] = [];

  let truthyCellsCount = 0;
  liveUnitMap.forEach((colInLiveUnitMap, colIdx) => {
    colInLiveUnitMap.forEach((isTruthy, rowIdx) => {
      if (isTruthy) {
        truthyCellsCount += 1;
        coordinates.push({
          x: colIdx + coordinateOffset.x,
          y: rowIdx + coordinateOffset.y,
        });
      }
    });
  });

  if (truthyCellsCount === 0) {
    return null;
  }

  return coordinates;
}

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  relativeCoordinates: CoordinateVO[] | null;
  onRelativeCoordinatesUpdate: (coordinates: CoordinateVO[] | null) => void;
};

function GameRoomSideBar({ align, onLogoClick, relativeCoordinates, onRelativeCoordinatesUpdate }: Props) {
  const [coordinateOffset] = useState<CoordinateVO>({ x: -2, y: -2 });
  const [boardWidth, boardHeight] = [5, 5];

  const [isLiveUnitMapHovered, setIsLiveUnitMapHovered] = useState<boolean>(false);
  const [isEditLiveUnitMapModalVisible, setIsEditLiveUnitMapModalVisible] = useState<boolean>(false);

  const handleLiveUnitMapItemClick = () => {
    setIsEditLiveUnitMapModalVisible(true);
  };
  const handleLiveUnitMapCancel = () => {
    setIsEditLiveUnitMapModalVisible(false);
  };
  const handleLiveUnitMapUpdate = (liveUnitMap: LiveUnitMapVO) => {
    const newRelativeCoordinates = convertLiveUnitMapToRelativeCoordinates(liveUnitMap, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsEditLiveUnitMapModalVisible(false);
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
        hovered={isLiveUnitMapHovered}
        onClick={handleLiveUnitMapItemClick}
        onMouseEnter={() => {
          setIsLiveUnitMapHovered(true);
        }}
        onMouseLeave={() => {
          setIsLiveUnitMapHovered(false);
        }}
      >
        <LiveUnitMapIcon highlighted={isLiveUnitMapHovered} active={!!relativeCoordinates} />
      </ItemWrapper>
      <EditLiveUnitMapModal
        opened={isEditLiveUnitMapModalVisible}
        liveUnitMap={liveUnitMap}
        onUpdate={handleLiveUnitMapUpdate}
        onCancel={handleLiveUnitMapCancel}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
