import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ItemAgg } from '@/models/aggregates';

import ItemBox from '.';

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
  item: ItemAgg.new({ id: '123', name: 'stone', traversable: true, assetSrc: 'placeholder-item.png' }),
};
