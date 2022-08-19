import { useState, useEffect } from 'react';
import range from 'lodash/range';
import { CoordinateVO } from '@/valueObjects';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import EditUnitPatternModal from '@/components/modals/EditUnitPatternModal';
import type { UnitPatternVO } from '@/valueObjects';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

function convertRelativeCoordinatesToUnitPattern(
  relativeCoordinates: CoordinateVO[] | null,
  coordinateOffset: CoordinateVO,
  boardWidth: number,
  boardHeight: number
): UnitPatternVO {
  const unitPattern: UnitPatternVO = [];
  range(0, boardWidth).forEach((colIdx) => {
    unitPattern.push([]);
    range(0, boardHeight).forEach(() => {
      unitPattern[colIdx].push(null);
    });
  });

  if (!relativeCoordinates) {
    return unitPattern;
  }

  relativeCoordinates.forEach((relativeCoordinate) => {
    const colIdx = relativeCoordinate.x - coordinateOffset.x;
    const rowIdx = relativeCoordinate.y - coordinateOffset.y;
    if (unitPattern?.[colIdx]?.[rowIdx] !== undefined) {
      unitPattern[colIdx][rowIdx] = true;
    }
  });

  return unitPattern;
}

function convertUnitPatternToRelativeCoordinates(
  unitPattern: UnitPatternVO,
  coordinateOffset: CoordinateVO
): CoordinateVO[] | null {
  const coordinates: CoordinateVO[] = [];

  let truthyCellsCount = 0;
  unitPattern.forEach((unitCol, colIdx) => {
    unitCol.forEach((isTruthy, rowIdx) => {
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
  isMiniMapActive: boolean;
  onMiniMapClick: () => void;
};

function GameRoomSideBar({
  align,
  onLogoClick,
  relativeCoordinates,
  onRelativeCoordinatesUpdate,
  isMiniMapActive,
  onMiniMapClick,
}: Props) {
  const [coordinateOffset] = useState<CoordinateVO>({ x: -2, y: -2 });
  const [boardWidth, boardHeight] = [5, 5];

  const [isUnitPatternHovered, setIsUnitPatternHovered] = useState<boolean>(false);
  const [isEditUnitPatternModalVisible, setIsEditUnitPatternModalVisible] = useState<boolean>(false);

  const [isMiniMapHovered, setIsMiniMapHovered] = useState<boolean>(false);

  const handleUnitPatternItemClick = () => {
    setIsEditUnitPatternModalVisible(true);
  };
  const handleUnitPatternCancel = () => {
    setIsEditUnitPatternModalVisible(false);
  };
  const handleUnitPatternUpdate = (unitPattern: UnitPatternVO) => {
    const newRelativeCoordinates = convertUnitPatternToRelativeCoordinates(unitPattern, coordinateOffset);
    onRelativeCoordinatesUpdate(newRelativeCoordinates);
    setIsEditUnitPatternModalVisible(false);
  };

  const [unitPattern, setUnitPattern] = useState<UnitPatternVO>([]);
  useEffect(() => {
    const newUnitPattern = convertRelativeCoordinatesToUnitPattern(
      relativeCoordinates,
      coordinateOffset,
      boardWidth,
      boardHeight
    );
    setUnitPattern(newUnitPattern);
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
        hovered={isUnitPatternHovered}
        onClick={handleUnitPatternItemClick}
        onMouseEnter={() => {
          setIsUnitPatternHovered(true);
        }}
        onMouseLeave={() => {
          setIsUnitPatternHovered(false);
        }}
      >
        <UnitPatternIcon highlighted={isUnitPatternHovered} active={!!relativeCoordinates} />
      </ItemWrapper>
      <ItemWrapper
        hovered={isMiniMapHovered}
        onClick={onMiniMapClick}
        onMouseEnter={() => {
          setIsMiniMapHovered(true);
        }}
        onMouseLeave={() => {
          setIsMiniMapHovered(false);
        }}
      >
        <UnitPatternIcon highlighted={isMiniMapHovered} active={isMiniMapActive} />
      </ItemWrapper>
      <EditUnitPatternModal
        opened={isEditUnitPatternModalVisible}
        unitPattern={unitPattern}
        onUpdate={handleUnitPatternUpdate}
        onCancel={handleUnitPatternCancel}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
