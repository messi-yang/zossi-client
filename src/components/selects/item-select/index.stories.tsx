import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ItemModel } from '@/models/world/item/item-model';

import { ItemSelect } from '.';

export default {
  title: 'Select/ItemSelect',
  component: ItemSelect,
  argTypes: {},
} as Meta<typeof ItemSelect>;

const Template: StoryFn<typeof ItemSelect> = function Template(args) {
  const [, updateArgs] = useArgs();

  const handleItemSelect = (item: ItemModel) => {
    updateArgs({
      selectedItemId: item.getId(),
    });
  };

  return <ItemSelect {...args} onSelect={handleItemSelect} />;
};

const items = [ItemModel.createMock(), ItemModel.createMock(), ItemModel.createMock()];

export const Primary = Template.bind({});
Primary.args = {
  selectedItemId: items[0].getId(),
  items,
};
