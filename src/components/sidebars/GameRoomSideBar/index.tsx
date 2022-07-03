import { useState } from 'react';
import GameOfLibertyLogo from '@/components/logos/GameOfLibertyLogo';
import UnitMapIcon from '@/components/icons/UnitMapIcon';
import ItemWrapper from './ItemWrapper';

type HoverStateFlags = {
  unitMap: boolean;
};

function GameRoomSideBar() {
  const [hoverStateFlags, setHoverStateFlags] = useState<HoverStateFlags>({
    unitMap: false,
  });

  function handleHoverStateChange(key: 'unitMap', hovered: boolean) {
    const newFlags = { ...hoverStateFlags };
    newFlags[key] = hovered;
    setHoverStateFlags(newFlags);
  }

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
      <ItemWrapper
        hovered={false}
        width="100%"
        height="70px"
        onHoverStateChange={() => {}}
      >
        <GameOfLibertyLogo />
      </ItemWrapper>
      <ItemWrapper
        width="100%"
        height="70px"
        hovered={hoverStateFlags.unitMap}
        onHoverStateChange={(hovered) => {
          handleHoverStateChange('unitMap', hovered);
        }}
      >
        <UnitMapIcon hovered={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
    </section>
  );
}

export default GameRoomSideBar;
