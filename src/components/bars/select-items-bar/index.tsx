import classnames from 'classnames';
import { ItemBox } from '@/components/boxes/item-box';
import { ItemModel } from '@/models/world/item/item-model';
import { dataTestids } from './data-test-ids';

type Props = {
  selectedItemId: string | null;
  items: ItemModel[] | null;
  onSelect?: (item: ItemModel) => void;
};

export function SelectItemsBar({ selectedItemId, items, onSelect = () => {} }: Props) {
  const handleItemSelect = (item: ItemModel) => {
    onSelect(item);
  };

  const selectedItem = items?.find((item) => item.getId() === selectedItemId) || null;

  return (
    <section data-testid={dataTestids.root} className="w-[1000px] grid grid-cols-12 gap-2">
      {(items || []).map((item) => (
        <div key={item.getId()} className={classnames('aspect-square')}>
          <ItemBox item={item} active={selectedItem?.getId() === item.getId()} onClick={() => handleItemSelect(item)} />
        </div>
      ))}
    </section>
  );
}
