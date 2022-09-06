import { useState } from 'react';
import flatten from 'lodash/flatten';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import MapMarkerIcon from '@/components/icons/MapMarkerIcon';
import EditUnitPatternModal from '@/components/modals/EditUnitPatternModal';
import type { UnitPatternVO } from '@/valueObjects';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  unitPattern: UnitPatternVO;
  onUnitPatternUpdate: (unitPattern: UnitPatternVO) => void;
  isMiniMapActive: boolean;
  onMiniMapClick: () => void;
};

function GameRoomSideBar({
  align,
  onLogoClick,
  unitPattern,
  onUnitPatternUpdate,
  isMiniMapActive,
  onMiniMapClick,
}: Props) {
  const [isUnitPatternHovered, setIsUnitPatternHovered] = useState<boolean>(false);
  const [isEditUnitPatternModalVisible, setIsEditUnitPatternModalVisible] = useState<boolean>(false);

  const [isMiniMapHovered, setIsMiniMapHovered] = useState<boolean>(false);

  const isUnitPatternEmpty = flatten(unitPattern).findIndex((alive) => alive) === -1;

  const handleUnitPatternItemClick = () => {
    setIsEditUnitPatternModalVisible(true);
  };
  const handleUnitPatternCancel = () => {
    setIsEditUnitPatternModalVisible(false);
  };
  const handleUnitPatternUpdate = (newUnitPattern: UnitPatternVO) => {
    onUnitPatternUpdate(newUnitPattern);
    setIsEditUnitPatternModalVisible(false);
  };

  return (
    <section
      data-testid={dataTestids.root}
      className={[
        align === 'column' ? 'w-16' : 'w-100',
        align === 'row' ? 'h-16' : 'w-100',
        'flex',
        align === 'column' ? 'flex-col' : 'flex-row',
      ].join(' ')}
      style={{
        backgroundColor: '#1C1C1C',
      }}
    >
      <ItemWrapper highlighted={false} active={false} hovered={false} onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        label="Pattern"
        highlighted={isUnitPatternHovered}
        active={!isUnitPatternEmpty}
        hovered={isUnitPatternHovered}
        onClick={handleUnitPatternItemClick}
        onMouseEnter={() => {
          setIsUnitPatternHovered(true);
        }}
        onMouseLeave={() => {
          setIsUnitPatternHovered(false);
        }}
      >
        <UnitPatternIcon highlighted={isUnitPatternHovered} active={!isUnitPatternEmpty} />
      </ItemWrapper>
      <ItemWrapper
        label="Map"
        highlighted={isMiniMapHovered}
        active={isMiniMapActive}
        hovered={isMiniMapHovered}
        onClick={onMiniMapClick}
        onMouseEnter={() => {
          setIsMiniMapHovered(true);
        }}
        onMouseLeave={() => {
          setIsMiniMapHovered(false);
        }}
      >
        <MapMarkerIcon highlighted={isMiniMapHovered} active={isMiniMapActive} />
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
