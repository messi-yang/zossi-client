import { useState } from 'react';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import MapMarkerIcon from '@/components/icons/MapMarkerIcon';
import EditUnitPatternModal from '@/components/modals/EditUnitPatternModal';
import { UnitPatternValueObject } from '@/valueObjects';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  unitPattern: UnitPatternValueObject;
  onUnitPatternUpdate: (unitPattern: UnitPatternValueObject) => void;
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

  const isUnitPatternEmpty = unitPattern.isEmpty();

  const handleUnitPatternItemClick = () => {
    setIsEditUnitPatternModalVisible(true);
  };
  const handleUnitPatternCancel = () => {
    setIsEditUnitPatternModalVisible(false);
  };
  const handleUnitPatternUpdate = (newUnitPattern: UnitPatternValueObject) => {
    onUnitPatternUpdate(newUnitPattern);
    setIsEditUnitPatternModalVisible(false);
  };

  return (
    <section
      data-testid={dataTestids.root}
      className={[
        align === 'column' ? 'w-[78px]' : 'w-full',
        align === 'row' ? 'h-[78px]' : 'h-full',
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
