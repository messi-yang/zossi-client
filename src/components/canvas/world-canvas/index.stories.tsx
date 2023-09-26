import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { WorldCanvas } from '.';

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
Primary.args = {};
