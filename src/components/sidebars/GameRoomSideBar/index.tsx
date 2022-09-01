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
      style={{
        width: align === 'column' ? '78px' : '100%',
        height: align === 'row' ? '78px' : '100%',
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
        <UnitPatternIcon highlighted={isUnitPatternHovered} active={!isUnitPatternEmpty} />
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
