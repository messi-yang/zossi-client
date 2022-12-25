import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BuildItemIcon from '.';

export default {
  title: 'Icon/BuildItemIcon',
  component: BuildItemIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof BuildItemIcon>;

const Template: ComponentStory<typeof BuildItemIcon> = function Template(args) {
  return <BuildItemIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
