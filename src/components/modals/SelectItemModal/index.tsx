import classnames from 'classnames';
import Text from '@/components/text/Text';
import BaseModal from '@/components/modals/BaseModal';
import ItemBox from '@/components/boxes/ItemBox';
import Button from '@/components/buttons/Button';
import { ItemAgg } from '@/models/aggregates';
import dataTestids from './dataTestids';

type Props = {
  opened: boolean;
  width: number;
  selectedItemId: string;
  items: ItemAgg[];
  onSelect?: (itemId: string) => void;
  onDone?: () => void;
};

function SelectItemModal({ opened, width, selectedItemId, items, onSelect = () => {}, onDone = () => {} }: Props) {
  const selectedItem = items.find((item) => item.getId() === selectedItemId);

  const handleItemSelect = (item: ItemAgg) => {
    onSelect(item.getId());
  };

  return (
    <BaseModal width={width} opened={opened} onBackgroundClick={onDone}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 pb-10 w-full h-full flex flex-col items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text color="white" copy="Select Item" size={18} />
        <div className="mt-9 w-full flex justify-center">
          <div className="w-[150px] h-[150px]">{selectedItem && <ItemBox item={selectedItem} />}</div>
        </div>
        <section className="mt-6 w-full overflow-auto">
          <section className="flex">
            {items.map((item) => (
              <div key={item.getId()} className={classnames('w-[70px]', 'h-[70px]', 'shrink-0', 'mr-2')}>
                <ItemBox item={item} active={selectedItemId === item.getId()} onClick={() => handleItemSelect(item)} />
              </div>
            ))}
          </section>
        </section>
        <section className="mt-9 flex justify-center">
          <Button text="Ok" onClick={onDone} />
        </section>
      </section>
    </BaseModal>
  );
}

export default SelectItemModal;
export { dataTestids };
