import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ItemModel } from '@/models/world/item/item-model';

import { ItemBox } from '.';

export default {
  title: 'Box/ItemBox',
  component: ItemBox,
  argTypes: {},
} as Meta<typeof ItemBox>;

const Template: StoryFn<typeof ItemBox> = function Template(args) {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      <ItemBox {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  item: ItemModel.mockup(),
};
