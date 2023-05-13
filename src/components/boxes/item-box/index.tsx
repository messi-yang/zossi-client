import { KeyboardEventHandler } from 'react';
import classnames from 'classnames';
import { ItemModel } from '@/models';
import { dataTestids } from './data-test-ids';

type Props = {
  item: ItemModel;
  active?: boolean;
  onClick?: () => void;
};

export function ItemBox({ item, active, onClick }: Props) {
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (evt) => {
    if (evt.code === 'Enter') {
      onClick?.();
    }
  };

  return (
    <div
      data-testid={dataTestids.root}
      className={classnames(
        'w-full',
        'h-full',
        'flex',
        'items-center',
        'justify-center',
        'border-4',
        active ? 'border-[#01D6C9]' : 'border-stone-500',
        'box-border',
        'cursor-pointer',
        'bg-black'
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <img className="w-full h-full" src={item.getThumbnailSrc()} alt={item.getName()} />
    </div>
  );
}
