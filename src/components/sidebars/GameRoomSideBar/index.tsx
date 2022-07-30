import { useState } from 'react';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitMapIcon from '@/components/icons/UnitMapIcon';
import EditRelativeCoordinatesModal from '@/components/modals/EditRelativeCoordinatesModal';
import ItemWrapper from './ItemWrapper';
import dataTestids from './dataTestids';

export type Coordinate = {
  x: number;
  y: number;
};

type HoverStateFlags = {
  unitMap: boolean;
};

type Props = {
  relativeCoordinates: Coordinate[];
  onRelativeCoordinatesUpdate: (coordinates: Coordinate[]) => void;
};

function GameRoomSideBar({
  relativeCoordinates,
  onRelativeCoordinatesUpdate,
}: Props) {
  const [hoverStateFlags, setHoverStateFlags] = useState<HoverStateFlags>({
    unitMap: false,
  });

  function handleHoverStateChange(key: 'unitMap', hovered: boolean) {
    const newFlags = { ...hoverStateFlags };
    newFlags[key] = hovered;
    setHoverStateFlags(newFlags);
  }

  const [isUnitsPatternVisible, setIsUnitsPatternVisible] =
    useState<boolean>(false);
  const handleUnitsPatternItemClick = () => {
    setIsUnitsPatternVisible(true);
  };
  const handleUnitsPatternUpdate = (coordinates: Coordinate[]) => {
    onRelativeCoordinatesUpdate(coordinates);
    setIsUnitsPatternVisible(false);
  };

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
      <ItemWrapper hovered={false} width="100%" height="70px">
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        width="100%"
        height="70px"
        hovered={hoverStateFlags.unitMap}
        onHoverStateChange={(hovered) => {
          handleHoverStateChange('unitMap', hovered);
        }}
        onClick={handleUnitsPatternItemClick}
      >
        <UnitMapIcon highlighted={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
      <EditRelativeCoordinatesModal
        opened={isUnitsPatternVisible}
        relativeCoordinates={relativeCoordinates}
        onPatternUpdate={handleUnitsPatternUpdate}
      />
    </section>
  );
}

export default GameRoomSideBar;
