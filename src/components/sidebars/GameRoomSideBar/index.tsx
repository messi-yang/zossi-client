import { useState, useContext } from 'react';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitMapIcon from '@/components/icons/UnitMapIcon';
import UnitsPatternModal from '@/components/modals/UnitsPatternModal';
import ItemWrapper from './ItemWrapper';

type Coordinate = {
  x: number;
  y: number;
};

type HoverStateFlags = {
  unitMap: boolean;
};

function GameRoomSideBar() {
  const { relativeCoordinates, updateRelativeCoordinates } =
    useContext(GameOfLibertyContext);

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
    updateRelativeCoordinates(coordinates);
    setIsUnitsPatternVisible(false);
  };

  return (
    <section
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
      <UnitsPatternModal
        opened={isUnitsPatternVisible}
        relativeCoordinates={relativeCoordinates}
        onPatternUpdate={handleUnitsPatternUpdate}
      />
    </section>
  );
}

export default GameRoomSideBar;
