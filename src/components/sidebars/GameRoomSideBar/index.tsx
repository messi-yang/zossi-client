import { useState, useMemo } from 'react';
import range from 'lodash/range';
import { CoordinateEntity } from '@/entities';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import EditLiveUnitBoardModal from '@/components/modals/EditLiveUnitBoardModal';
import type { LiveUnitBoardEntity } from '@/entities/';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

function convertRelativeCoordinatesToLiveUnitBoard(
  relativeCoordinates: CoordinateEntity[],
  coordinateOffset: CoordinateEntity,
  boardWidth: number,
  boardHeight: number
): LiveUnitBoardEntity {
  const liveUnitBoard: LiveUnitBoardEntity = [];
  range(0, boardWidth).forEach((colIdx) => {
    liveUnitBoard.push([]);
    range(0, boardHeight).forEach(() => {
      liveUnitBoard[colIdx].push(false);
    });
  });

  relativeCoordinates.forEach((relativeCoordinate) => {
    const colIdx = relativeCoordinate.x - coordinateOffset.x;
    const rowIdx = relativeCoordinate.y - coordinateOffset.y;
    if (liveUnitBoard?.[colIdx]?.[rowIdx] !== undefined) {
      liveUnitBoard[colIdx][rowIdx] = true;
    }
  });

  return liveUnitBoard;
}

function convertLiveUnitBoardToRelativeCoordinates(
  liveUnitBoard: LiveUnitBoardEntity,
  coordinateOffset: CoordinateEntity
): CoordinateEntity[] {
  const coordinates: CoordinateEntity[] = [];

  liveUnitBoard.forEach((colInLiveUnitBoard, colIdx) => {
    colInLiveUnitBoard.forEach((isTruthy, rowIdx) => {
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

  const [isLiveUnitBoardVisible, setIsLiveUnitBoardVisible] = useState<boolean>(false);
  const handleLiveUnitBoardItemClick = () => {
    setIsLiveUnitBoardVisible(true);
  };
  const handleLiveUnitBoardCancel = () => {
    setIsLiveUnitBoardVisible(false);
  };
  const handleLiveUnitBoardUpdate = (liveUnitBoard: LiveUnitBoardEntity) => {
    const newRelativeCoordinates = convertLiveUnitBoardToRelativeCoordinates(liveUnitBoard, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsLiveUnitBoardVisible(false);
  };

  const [liveUnitBoard, setLiveUnitBoard] = useState<LiveUnitBoardEntity>([]);
  useMemo(() => {
    const newLiveUnitBoard = convertRelativeCoordinatesToLiveUnitBoard(
      relativeCoordinates,
      coordinateOffset,
      boardWidth,
      boardHeight
    );
    setLiveUnitBoard(newLiveUnitBoard);
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
        onClick={handleLiveUnitBoardItemClick}
      >
        <UnitPatternIcon highlighted={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
      <EditLiveUnitBoardModal
        opened={isLiveUnitBoardVisible}
        liveUnitBoard={liveUnitBoard}
        onUpdate={handleLiveUnitBoardUpdate}
        onCancel={handleLiveUnitBoardCancel}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
