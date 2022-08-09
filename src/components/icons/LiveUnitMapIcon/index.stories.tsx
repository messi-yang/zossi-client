import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LiveUnitMapIcon from '.';

export default {
  title: 'Icon/LiveUnitMapIcon',
  component: LiveUnitMapIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof LiveUnitMapIcon>;

const Template: ComponentStory<typeof LiveUnitMapIcon> = function Template(args) {
  return <LiveUnitMapIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
