import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PlaceItemIcon from '.';

export default {
  title: 'Icon/PlaceItemIcon',
  component: PlaceItemIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof PlaceItemIcon>;

const Template: ComponentStory<typeof PlaceItemIcon> = function Template(args) {
  return <PlaceItemIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
