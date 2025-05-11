import React, { useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { dataTestids } from './data-test-ids';
import { useClickOutside } from '@/hooks/use-click-outside';
import { Text } from '@/components/texts/text';
// import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
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
      <Icon icon="iconamoon:arrow-up-2-light" width={24} height={24} rotate={90} />
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

function AnchorDropdown({ options, onSelect }: { options: { label: string; value: number }[]; onSelect: (value: number) => void }) {
  return (
    <div className={twMerge('flex', 'flex-col', 'gap-1', 'p-2', 'rounded-[10px]')}>
      {options.map((option) => (
        <div
          key={option.value}
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
          onClick={() => onSelect(option.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelect(option.value);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <Text size="text-lg">{option.label}</Text>
        </div>
      ))}
    </div>
  );
}

interface Props {
  selectedItem: ItemModel | null;
  activeTab: 'select' | 'build' | 'destroy' | null;
  onMoveClick: () => void;
  onRotateSelectedItemClick: () => void;
  onBuildClick: () => void;
  onCameraClick: () => void;
  onReplayClick: (duration: number) => void;
  onDestroyClick: () => void;
}

export function WorldBottomPanel({
  selectedItem,
  activeTab,
  onMoveClick,
  onRotateSelectedItemClick,
  onBuildClick,
  onCameraClick,
  onReplayClick,
  onDestroyClick,
}: Props) {
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useState(false);
  const [isReplayMenuOpen, setIsReplayMenuOpen] = useState(false);
  // const handleBuildMenuClick = useCallback(() => {
  //   setIsBuildMenuOpen(!isBuildMenuOpen);
  // }, [isBuildMenuOpen]);

  const [wrapperDom, setWrapperDom] = useState<HTMLDivElement | null>(null);

  useClickOutside(wrapperDom, () => {
    setIsBuildMenuOpen(false);
    setIsReplayMenuOpen(false);
  });

  const handleBuildClick = useCallback(() => {
    onBuildClick();
  }, [onBuildClick]);

  const replayDurationOptions = useMemo(() => {
    return [
      { label: '5s', value: 5000 },
      { label: '10s', value: 10000 },
      { label: '20s', value: 20000 },
      { label: '30s', value: 30000 },
    ];
  }, []);

  const handleReplayClick = useCallback(
    (duration: number) => {
      onReplayClick(duration);
      setIsReplayMenuOpen(false);
    },
    [onReplayClick]
  );

  return (
    <div
      data-testid={dataTestids.root}
      ref={(ref) => {
        setWrapperDom(ref);
      }}
      className={twMerge('inline-flex', 'h-16', 'p-2', 'gap-2', BG_COLOR_CLASS, 'rounded-[10px]')}
    >
      <BottomPanelButton icon="mage:mouse-pointer" active={activeTab === 'select'} onClick={onMoveClick} />
      <div className={twMerge('flex', 'items-center', 'flex-row')}>
        {!selectedItem && (
          <BottomPanelButton icon="icon-park-outline:hammer-and-anvil" active={activeTab === 'build'} onClick={handleBuildClick} />
        )}
        {selectedItem && (
          <div
            className={twMerge('w-12', 'h-12', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'bg-blue-600', 'rounded-lg')}
            onClick={onRotateSelectedItemClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRotateSelectedItemClick();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Image src={selectedItem.getThumbnailSrc()} alt={selectedItem.getName()} width={36} height={36} />
          </div>
        )}
        <MenuAnchor opened={isBuildMenuOpen} onClick={onBuildClick}>
          <AnchorDropdown options={[]} onSelect={handleBuildClick} />
        </MenuAnchor>
      </div>
      <BottomPanelButton icon="ant-design:video-camera-outlined" active={false} onClick={onCameraClick} />
      <div className={twMerge('flex', 'items-center', 'flex-row')}>
        <BottomPanelButton
          icon="fluent:replay-24-regular"
          active={false}
          onClick={() => handleReplayClick(replayDurationOptions[0].value)}
        />
        <MenuAnchor opened={isReplayMenuOpen} onClick={() => setIsReplayMenuOpen(!isReplayMenuOpen)}>
          <AnchorDropdown options={replayDurationOptions} onSelect={handleReplayClick} />
        </MenuAnchor>
      </div>
      <BottomPanelButton icon="material-symbols:delete-outline" active={activeTab === 'destroy'} onClick={onDestroyClick} />
    </div>
  );
}
