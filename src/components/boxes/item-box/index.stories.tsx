import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ItemModel } from '@/models';

import { ItemBox } from '.';

export default {
  title: 'Box/ItemBox',
  component: ItemBox,
  argTypes: {},
} as ComponentMeta<typeof ItemBox>;

const Template: ComponentStory<typeof ItemBox> = function Template(args) {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      <ItemBox {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  item: ItemModel.newMockupItem(),
};
