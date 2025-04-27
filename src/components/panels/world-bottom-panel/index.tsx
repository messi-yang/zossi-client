import React, { useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { dataTestids } from './data-test-ids';
import { useClickOutside } from '@/hooks/use-click-outside';
import { Text } from '@/components/texts/text';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { ItemModel } from '@/models/world/item/item-model';

const BG_COLOR_CLASS = 'bg-[rgba(34,34,34,0.8)]';

function BottomPanelButton({ icon, active, onClick }: { icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={twMerge(
        'w-12',
        'h-12',
        'inline-flex',
        'justify-center',
        'items-center',
        'text-white',
        active ? 'bg-blue-600' : 'bg-transparent',
        'hover:bg-blue-600',
        'rounded-lg',
        'cursor-pointer'
      )}
      onClick={onClick}
      type="button"
    >
      <Icon icon={icon} width={24} height={24} />
    </button>
  );
}

function BottomPanelMenuButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      className={twMerge(
        'flex',
        'justify-center',
        'items-center',
        'h-12',
        'w-6',
        active ? 'bg-[rgba(247,249,251,0.33)]' : 'bg-transparent',
        'hover:bg-[rgba(247,249,251,0.33)]',
        'rounded-lg',
        'text-white'
      )}
      onClick={onClick}
      type="button"
    >
      <Icon icon="iconamoon:arrow-up-2-light" width={24} height={24} />
    </button>
  );
}

function MenuAnchor({ children, opened, onClick }: { children: React.ReactNode; opened: boolean; onClick: () => void }) {
  return (
    <div className={twMerge('relative')}>
      <div
        className={twMerge(
          'absolute',
          '-top-3',
          'left-0',
          BG_COLOR_CLASS,
          'rounded-[10px]',
          '-translate-y-full',
          opened ? 'visible' : 'invisible'
        )}
      >
        {children}
      </div>
      <BottomPanelMenuButton active={opened} onClick={onClick} />
    </div>
  );
}

interface Props {
  selectedItem: ItemModel | null;
  onMoveClick: () => void;
  onBuildClick: () => void;
  onCameraClick: () => void;
}

export function WorldBottomPanel({ selectedItem, onMoveClick, onCameraClick, onBuildClick }: Props) {
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useState(false);

  const handleBuildMenuClick = useCallback(() => {
    setIsBuildMenuOpen(!isBuildMenuOpen);
  }, [isBuildMenuOpen]);

  const [wrapperDom, setWrapperDom] = useState<HTMLDivElement | null>(null);

  useClickOutside(wrapperDom, () => {
    setIsBuildMenuOpen(false);
  });

  const handleBuildClick = useCallback(() => {
    onBuildClick();
    setIsBuildMenuOpen(false);
  }, [onBuildClick]);

  const isMoveActive = useMemo(() => {
    return !selectedItem;
  }, [selectedItem]);

  const isBuildActive = useMemo(() => {
    return !!selectedItem;
  }, [selectedItem]);

  return (
    <div
      data-testid={dataTestids.root}
      ref={(ref) => {
        setWrapperDom(ref);
      }}
      className={twMerge('inline-flex', 'h-16', 'p-2', 'gap-2', BG_COLOR_CLASS, 'rounded-[10px]')}
    >
      <BottomPanelButton icon="mage:mouse-pointer" active={isMoveActive} onClick={onMoveClick} />
      <div className={twMerge('flex', 'items-center', 'flex-row')}>
        {!selectedItem && <BottomPanelButton icon="icon-park-outline:hammer-and-anvil" active={isBuildActive} onClick={handleBuildClick} />}
        {selectedItem && (
          <div
            className={twMerge('w-12', 'h-12', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'bg-blue-600', 'rounded-lg')}
            onClick={handleBuildClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBuildClick();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Image src={selectedItem.getThumbnailSrc()} alt={selectedItem.getName()} width={36} height={36} />
          </div>
        )}
        <MenuAnchor opened={isBuildMenuOpen} onClick={handleBuildMenuClick}>
          <div className={twMerge('flex', 'flex-col', 'gap-1', 'p-2', 'rounded-[10px]')}>
            {Object.values(UnitTypeEnum).map((unitType) => (
              <div
                key={unitType}
                className={twMerge(
                  'flex',
                  'items-center',
                  'justify-center',
                  'w-full',
                  'hover:bg-blue-600',
                  'rounded-lg',
                  'cursor-pointer',
                  'px-2',
                  'py-0.5'
                )}
                onClick={handleBuildClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBuildClick();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Text size="text-lg">{unitType.charAt(0).toUpperCase() + unitType.slice(1)}</Text>
              </div>
            ))}
          </div>
        </MenuAnchor>
      </div>
      <BottomPanelButton icon="ant-design:video-camera-outlined" active={false} onClick={onCameraClick} />
    </div>
  );
}
