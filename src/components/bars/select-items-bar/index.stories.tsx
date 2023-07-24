import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ItemModel } from '@/models';

import { SelectItemsBar } from '.';

export default {
  title: 'Bar/SelectItemsBar',
  component: SelectItemsBar,
  argTypes: {},
} as Meta<typeof SelectItemsBar>;

const Template: StoryFn<typeof SelectItemsBar> = function Template(args) {
  const [, updateArgs] = useArgs();

  const handleItemSelect = (item: ItemModel) => {
    updateArgs({
      selectedItemId: item.getId(),
    });
  };

  return <SelectItemsBar {...args} onSelect={handleItemSelect} />;
};

const items = [ItemModel.mockup(), ItemModel.mockup(), ItemModel.mockup()];

export const Primary = Template.bind({});
Primary.args = {
  selectedItemId: items[0].getId(),
  items,
};
