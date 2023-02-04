import { useState } from 'react';
import classnames from 'classnames';
import SmallLogo from '@/components/logos/SmallLogo';
import PlaceItemIcon from '@/components/icons/PlaceItemIcon';
import MapMarkerIcon from '@/components/icons/MapMarkerIcon';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type Props = {
  align: 'row' | 'column';
  onLogoClick: () => void;
  isPlaceItemActive: boolean;
  onPlaceItemClick: () => void;
  isDestroyActive: boolean;
  onDestroyClick: () => void;
  isMiniMapActive: boolean;
  onMiniMapClick: () => void;
};

function GameSideBar({
  align,
  onLogoClick,
  isPlaceItemActive,
  onPlaceItemClick,
  isDestroyActive,
  onDestroyClick,
  isMiniMapActive,
  onMiniMapClick,
}: Props) {
  const [isPlaceItemMenuHovered, setIsPlaceItemMenuHovered] = useState<boolean>(false);
  const [isDestroyMenuHovered, setIsDestroyMenuHovered] = useState<boolean>(false);
  const [isMiniMapHovered, setIsMiniMapHovered] = useState<boolean>(false);

  return (
    <section
      data-testid={dataTestids.root}
      className={classnames(
        align === 'column' ? 'w-[78px]' : 'w-full',
        align === 'row' ? 'h-[78px]' : 'h-full',
        'flex',
        align === 'column' ? 'flex-col' : 'flex-row',
        'bg-[#1C1C1C]'
      )}
    >
      <ItemWrapper highlighted={false} active={false} hovered={false} onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        label="Build"
        highlighted={isPlaceItemMenuHovered}
        active={isPlaceItemActive}
        hovered={isPlaceItemMenuHovered}
        onClick={onPlaceItemClick}
        onMouseEnter={() => {
          setIsPlaceItemMenuHovered(true);
        }}
        onMouseLeave={() => {
          setIsPlaceItemMenuHovered(false);
        }}
      >
        <PlaceItemIcon highlighted={isPlaceItemMenuHovered} active={isPlaceItemActive} />
      </ItemWrapper>
      <ItemWrapper
        label="Destroy"
        highlighted={isDestroyMenuHovered}
        active={isDestroyActive}
        hovered={isDestroyMenuHovered}
        onClick={onDestroyClick}
        onMouseEnter={() => {
          setIsDestroyMenuHovered(true);
        }}
        onMouseLeave={() => {
          setIsDestroyMenuHovered(false);
        }}
      >
        <PlaceItemIcon highlighted={isDestroyMenuHovered} active={isDestroyActive} />
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

export default GameSideBar;
export { dataTestids };
