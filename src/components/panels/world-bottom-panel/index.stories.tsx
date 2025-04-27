import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { WorldBottomPanel } from '.';

export default {
  title: 'Panel/WorldBottomPanel',
  component: WorldBottomPanel,
  argTypes: {},
} as Meta<typeof WorldBottomPanel>;

const Template: StoryFn<typeof WorldBottomPanel> = function Template(args) {
  return <WorldBottomPanel {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
