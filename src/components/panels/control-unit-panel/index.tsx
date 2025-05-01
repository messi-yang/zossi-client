import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '@iconify/react';
import { dataTestids } from './data-test-ids';

const BG_COLOR_CLASS = 'bg-[rgba(34,34,34,0.8)]';

function BottomPanelButton({ icon, onClick }: { icon: string; onClick: () => void }) {
  return (
    <button
      className={twMerge(
        'w-10',
        'h-10',
        'inline-flex',
        'justify-center',
        'items-center',
        'text-white',
        'bg-transparent',
        'hover:bg-blue-600',
        'rounded-lg',
        'cursor-pointer'
      )}
      onClick={onClick}
      type="button"
    >
      <Icon icon={icon} width={24} height={24} color="white" />
    </button>
  );
}

interface Props {
  onEngageClick: () => void;
  onRotateClick: () => void;
  onRemoveClick: () => void;
}

export function ControlUnitPanel({ onEngageClick, onRotateClick, onRemoveClick }: Props) {
  return (
    <div data-testid={dataTestids.root} className={twMerge('inline-flex', 'h-12', 'px-2', 'py-1', 'gap-2', BG_COLOR_CLASS, 'rounded-xl')}>
      <BottomPanelButton icon="hugeicons:play-list" onClick={onEngageClick} />
      <BottomPanelButton icon="hugeicons:rotate-360" onClick={onRotateClick} />
      <BottomPanelButton icon="pajamas:remove" onClick={onRemoveClick} />
    </div>
  );
}
