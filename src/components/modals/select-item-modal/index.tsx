import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { BaseModal } from '@/components/modals/base-modal';
import { dataTestids } from './data-test-ids';
import { ItemModel } from '@/models/world/item/item-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { Text } from '@/components/texts/text';

type Props = {
  opened: boolean;
  items: ItemModel[];
  selectedItemId: string | null;
  onItemSelect: (item: ItemModel) => void;
  onClose?: () => void;
};

export function SelectItemModal({ opened, items, selectedItemId, onItemSelect, onClose }: Props) {
  const [compatibleUnitType, setCompatibleUnitType] = useState<UnitTypeEnum>(UnitTypeEnum.Static);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.getCompatibleUnitType() === compatibleUnitType);
  }, [items, compatibleUnitType]);

  return (
    <BaseModal width={596} height={600} opened={opened} onBackgroundClick={onClose} onCrossClick={onClose}>
      <div data-testid={dataTestids.root} className="h-full flex flex-col gap-2">
        <div className="flex flex-row gap-5 justify-center">
          <Text size="text-2xl" color="text-white" weight="font-bold">
            Select an item
          </Text>
        </div>
        <div className="flex flex-row gap-1 items-center">
          {Object.values(UnitTypeEnum).map((unitType) => (
            <div
              key={unitType}
              className={twMerge(
                'h-10 flex flex-col px-[10px] rounded-lg items-center justify-center',
                unitType === compatibleUnitType && 'bg-blue-600'
              )}
              onClick={() => setCompatibleUnitType(unitType)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCompatibleUnitType(unitType);
                }
              }}
            >
              <Text size="text-lg" color="text-white" weight="font-medium">
                {unitType.charAt(0).toUpperCase() + unitType.slice(1)}
              </Text>
            </div>
          ))}
        </div>
        <div className="grow flex flex-row gap-4 flex-wrap overflow-y-auto">
          {filteredItems.map((item) => (
            <div
              key={item.getId()}
              onClick={() => onItemSelect(item)}
              tabIndex={0}
              role="button"
              className="flex flex-col gap-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onItemSelect(item);
                }
              }}
            >
              <div className={twMerge('flex', 'flex-col', 'gap-2', 'rounded-lg')}>
                <div
                  className={twMerge(
                    'w-[100px]',
                    'h-[100px]',
                    'bg-black',
                    selectedItemId === item.getId() && 'border-4 border-blue-600',
                    'rounded-lg'
                  )}
                >
                  <Image src={item.getThumbnailSrc()} alt={item.getName()} width={100} height={100} />
                </div>
                <div className="flex flex-row gap-2 justify-center">
                  <Text size="text-sm" color="text-white" weight="font-medium" align="text-center" lineHeight="leading-none">
                    {item.getName()}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
