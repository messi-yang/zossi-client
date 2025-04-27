import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { SelectItemModal } from '.';
import { ItemModel } from '@/models/world/item/item-model';

export default {
  title: 'Modal/SelectItemModal',
  component: SelectItemModal,
  argTypes: {},
} as Meta<typeof SelectItemModal>;

const Template: StoryFn<typeof SelectItemModal> = function Template(args) {
  return <SelectItemModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  items: [
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
    ItemModel.createMock(),
  ],
  selectedItemId: null,
  onItemSelect: () => {},
  onClose: () => {},
};
