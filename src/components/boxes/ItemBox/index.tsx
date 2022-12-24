import classnames from 'classnames';
import { ItemAgg } from '@/models/aggregates';
import Text from '@/components/text/Text';
import dataTestids from './dataTestids';

type Props = {
  item: ItemAgg;
  active?: boolean;
  onClick?: () => void;
};

function ItemBox({ item, active, onClick }: Props) {
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
        active ? 'border-[#01D6C9]' : 'border-transparent',
        'p-1',
        'box-border',
        'cursor-pointer',
        'bg-black'
      )}
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={0}
      role="button"
    >
      <Text copy={item.getName()} size={14} color="white" />
    </div>
  );
}

export default ItemBox;
export { dataTestids };
