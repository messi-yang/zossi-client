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
  item: ItemAgg.new({
    id: '414b5703-91d1-42fc-a007-36dd8f25e329',
    name: 'stone',
    traversable: true,
    thumbnailSrc: 'placeholder-item.png',
    modelSrc: 'placeholder-item.png',
  }),
};
