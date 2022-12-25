import { useState } from 'react';
import SmallLogo from '@/ui/components/logos/SmallLogo';
import BuildItemIcon from '@/ui/components/icons/BuildItemIcon';
import MapMarkerIcon from '@/ui/components/icons/MapMarkerIcon';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  isBuildItemActive: boolean;
  onBuildItemClick: () => void;
  isMiniMapActive: boolean;
  onMiniMapClick: () => void;
};

function GameRoomSideBar({
  align,
  onLogoClick,
  isBuildItemActive,
  onBuildItemClick,
  isMiniMapActive,
  onMiniMapClick,
}: Props) {
  const [isBuildItemMenuHovered, setIsBuildItemMenuHovered] = useState<boolean>(false);

  const [isMiniMapHovered, setIsMiniMapHovered] = useState<boolean>(false);

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
        highlighted={isBuildItemMenuHovered}
        active={isBuildItemActive}
        hovered={isBuildItemMenuHovered}
        onClick={onBuildItemClick}
        onMouseEnter={() => {
          setIsBuildItemMenuHovered(true);
        }}
        onMouseLeave={() => {
          setIsBuildItemMenuHovered(false);
        }}
      >
        <BuildItemIcon highlighted={isBuildItemMenuHovered} active={isBuildItemActive} />
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
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
