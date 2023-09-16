import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { WorldModel } from '@/models/world/world-model';

import { WorldCard } from '.';

export default {
  title: 'Card/WorldCard',
  component: WorldCard,
  argTypes: {},
} as Meta<typeof WorldCard>;

const Template: StoryFn<typeof WorldCard> = function Template(args) {
  return (
    <div className="w-[200px] h-[200px] flex items-center justify-center">
      <WorldCard {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  world: WorldModel.mockup(),
};
