import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { WorldCanvas } from '.';
import { ItemModel } from '@/models/world/item-model';
import { UnitModel } from '@/models/world/unit-model';

export default {
  title: 'Canvas/WorldCanvas',
  component: WorldCanvas,
  argTypes: {},
} as Meta<typeof WorldCanvas>;

const Template: StoryFn<typeof WorldCanvas> = function Template(args) {
  return (
    <div className="w-screen h-screen">
      <WorldCanvas {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
const item = ItemModel.mockup();
Primary.args = {
  units: [UnitModel.mockup(), UnitModel.mockup(), UnitModel.mockup()],
  items: [item],
};
