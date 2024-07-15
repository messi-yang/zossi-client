import { useCallback, useMemo, useState } from 'react';
import { BaseModal } from '@/components/modals/base-modal';
import { Button } from '@/components/buttons/button';
import { dataTestids } from './data-test-ids';
import { PositionVo } from '@/models/world/common/position-vo';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { PositionInput } from '@/components/inputs/position-input';
import { DimensionInput } from '@/components/inputs/dimension-input';
import { Field } from '@/components/fields/field';
import { Text } from '@/components/texts/text';
import { ItemModel } from '@/models/world/item/item-model';
import { ItemSelect } from '@/components/selects/item-select';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';

type Props = {
  opened: boolean;
  items: ItemModel[];
  onComfirm: (item: ItemModel, origin: PositionVo, dimension: DimensionVo) => void;
  onCancel: () => void;
};

export function BuildMazeModal({ opened, items, onComfirm = () => {}, onCancel }: Props) {
  const [item, setItem] = useState<ItemModel | null>(null);
  const availableItems = useMemo(() => items.filter((i) => i.getCompatibleUnitType() === UnitTypeEnum.Fence), [items]);

  const [origin, setOrigin] = useState(PositionVo.create(1, 1));
  const [dimension, setDimension] = useState(DimensionVo.create(3, 3));

  const handleDimensionChange = useCallback(
    (newDimension: DimensionVo) => {
      const width = dimension.getWidth();
      let newWidth = newDimension.getWidth();
      const depth = dimension.getDepth();
      let newDepth = newDimension.getDepth();

      if (newWidth > width) {
        newWidth = newWidth % 2 === 0 ? newWidth + 1 : newWidth;
      } else {
        newWidth = newWidth % 2 === 0 ? newWidth - 1 : newWidth;
      }

      if (newDepth > depth) {
        newDepth = newDepth % 2 === 0 ? newDepth + 1 : newDepth;
      } else {
        newDepth = newDepth % 2 === 0 ? newDepth - 1 : newDepth;
      }

      setDimension(DimensionVo.create(newWidth < 3 ? 3 : newWidth, newDepth < 3 ? 3 : newDepth));
    },
    [dimension]
  );

  const handleConfirm = useCallback(() => {
    if (!item) return;

    onComfirm(item, origin, dimension);
  }, [item, origin, dimension, onComfirm]);

  return (
    <BaseModal width={500} opened={opened} onCrossClick={onCancel}>
      <section
        data-testid={dataTestids.root}
        className="relative p-6 w-full h-full flex flex-col gap-4 items-center border-4 border-solid border-white bg-[#121212]"
      >
        <Text>Build Maze</Text>
        <Field label="Item">
          <ItemSelect selectedItemId={item?.getId() || null} items={availableItems} onSelect={setItem} />
        </Field>
        <Field label="Origin">
          <PositionInput value={origin} onInput={setOrigin} />
        </Field>
        <Field label="Dimension">
          <DimensionInput value={dimension} onInput={handleDimensionChange} />
        </Field>
        <Button text="Confirm" onClick={handleConfirm} />
      </section>
    </BaseModal>
  );
}
