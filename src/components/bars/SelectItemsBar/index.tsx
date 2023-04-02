import classnames from 'classnames';
import ItemBox from '@/components/boxes/ItemBox';
import { ItemAgg } from '@/models/aggregates';
import dataTestids from './dataTestids';

type Props = {
  selectedItemId: string | null;
  items: ItemAgg[] | null;
  onSelect?: (item: ItemAgg) => void;
};

function SelectItemsBar({ selectedItemId, items, onSelect = () => {} }: Props) {
  const handleItemSelect = (item: ItemAgg) => {
    onSelect(item);
  };

  const selectedItem = items?.find((item) => item.getId() === selectedItemId) || null;

  return (
    <section data-testid={dataTestids.root} className="flex">
      {(items || []).map((item) => (
        <div key={item.getId()} className={classnames('shrink-0', 'mr-2', 'flex', 'w-[70px]', 'h-[70px]')}>
          <ItemBox item={item} active={selectedItem?.getId() === item.getId()} onClick={() => handleItemSelect(item)} />
        </div>
      ))}
    </section>
  );
}

export default SelectItemsBar;
export { dataTestids };
