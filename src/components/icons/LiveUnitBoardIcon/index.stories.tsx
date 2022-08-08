import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LiveUnitBoardIcon from '.';

export default {
  title: 'Icon/LiveUnitBoardIcon',
  component: LiveUnitBoardIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof LiveUnitBoardIcon>;

const Template: ComponentStory<typeof LiveUnitBoardIcon> = function Template(args) {
  return <LiveUnitBoardIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
