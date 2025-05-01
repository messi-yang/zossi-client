import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { ControlUnitPanel } from '.';

export default {
  title: 'Panel/ControlUnitPanel',
  component: ControlUnitPanel,
  argTypes: {},
} as Meta<typeof ControlUnitPanel>;

const Template: StoryFn<typeof ControlUnitPanel> = function Template(args) {
  return <ControlUnitPanel {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
