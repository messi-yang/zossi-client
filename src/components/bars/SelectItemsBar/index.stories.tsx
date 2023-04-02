import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ItemAgg } from '@/models/aggregates';

import SelectItemsBar from '.';

export default {
  title: 'Bar/SelectItemsBar',
  component: SelectItemsBar,
  argTypes: {},
} as ComponentMeta<typeof SelectItemsBar>;

const Template: ComponentStory<typeof SelectItemsBar> = function Template(args) {
  const [, updateArgs] = useArgs();

  const handleItemSelect = (item: ItemAgg) => {
    updateArgs({
      selectedItemId: item.getId(),
    });
  };

  return <SelectItemsBar {...args} onSelect={handleItemSelect} />;
};

const items = [ItemAgg.newMockupItem(), ItemAgg.newMockupItem(), ItemAgg.newMockupItem()];

export const Primary = Template.bind({});
Primary.args = {
  selectedItemId: items[0].getId(),
  items,
};
