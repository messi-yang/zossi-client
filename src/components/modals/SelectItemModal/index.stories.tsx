import React from 'react';
import range from 'lodash/range';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ItemAgg } from '@/models/aggregates';

import SelectItemModal from '.';

export default {
  title: 'Modal/SelectItemModal',
  component: SelectItemModal,
  argTypes: {},
} as ComponentMeta<typeof SelectItemModal>;

const Template: ComponentStory<typeof SelectItemModal> = function Template(args) {
  const [, updateArgs] = useArgs();

  const handleItemSelect = (itemId: string) => {
    updateArgs({
      selectedItemId: itemId,
    });
  };

  return <SelectItemModal {...args} onSelect={handleItemSelect} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  width: 300,
  selectedItemId: 'sample-1',
  items: range(10).map((num) => ItemAgg.newItemAgg({ id: `sample-${num + 1}`, name: `Sample ${num + 1}` })),
};
