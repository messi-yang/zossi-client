import { useState, useMemo } from 'react';
import range from 'lodash/range';
import { CoordinateEntity } from '@/entities';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import EditLiveUnitsBoardModal from '@/components/modals/EditLiveUnitBoardModal';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type LiveUnitsBoard = boolean[][];

function convertRelativeCoordinatesToLiveUnitsBoard(
  relativeCoordinates: CoordinateEntity[],
  coordinateOffset: CoordinateEntity,
  boardWidth: number,
  boardHeight: number
): LiveUnitsBoard {
  const liveUnitsBoard: LiveUnitsBoard = [];
  range(0, boardWidth).forEach((colIdx) => {
    liveUnitsBoard.push([]);
    range(0, boardHeight).forEach(() => {
      liveUnitsBoard[colIdx].push(false);
    });
  });

  relativeCoordinates.forEach((relativeCoordinate) => {
    const colIdx = relativeCoordinate.x - coordinateOffset.x;
    const rowIdx = relativeCoordinate.y - coordinateOffset.y;
    if (liveUnitsBoard?.[colIdx]?.[rowIdx] !== undefined) {
      liveUnitsBoard[colIdx][rowIdx] = true;
    }
  });

  return liveUnitsBoard;
}

function convertLiveUnitsBoardToRelativeCoordinates(
  liveUnitsBoard: LiveUnitsBoard,
  coordinateOffset: CoordinateEntity
): CoordinateEntity[] {
  const coordinates: CoordinateEntity[] = [];

  liveUnitsBoard.forEach((colInLiveUnitsBoard, colIdx) => {
    colInLiveUnitsBoard.forEach((isTruthy, rowIdx) => {
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

  const [isLiveUnitsBoardVisible, setIsLiveUnitsBoardVisible] = useState<boolean>(false);
  const handleLiveUnitsBoardItemClick = () => {
    setIsLiveUnitsBoardVisible(true);
  };
  const handleLiveUnitsBoardCancel = () => {
    setIsLiveUnitsBoardVisible(false);
  };
  const handleLiveUnitsBoardUpdate = (liveUnitsBoard: LiveUnitsBoard) => {
    const newRelativeCoordinates = convertLiveUnitsBoardToRelativeCoordinates(liveUnitsBoard, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsLiveUnitsBoardVisible(false);
  };

  const [liveUnitsBoard, setLiveUnitsBoard] = useState<LiveUnitsBoard>([]);
  useMemo(() => {
    const newLiveUnitsBoard = convertRelativeCoordinatesToLiveUnitsBoard(
      relativeCoordinates,
      coordinateOffset,
      boardWidth,
      boardHeight
    );
    setLiveUnitsBoard(newLiveUnitsBoard);
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
        onClick={handleLiveUnitsBoardItemClick}
      >
        <UnitPatternIcon highlighted={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
      <EditLiveUnitsBoardModal
        opened={isLiveUnitsBoardVisible}
        liveUnitBoard={liveUnitsBoard}
        onUpdate={handleLiveUnitsBoardUpdate}
        onCancel={handleLiveUnitsBoardCancel}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
