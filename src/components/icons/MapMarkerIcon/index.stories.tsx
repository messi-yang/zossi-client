import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MapMarkerIcon from '.';

export default {
  title: 'Icon/MapMarkerIcon',
  component: MapMarkerIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof MapMarkerIcon>;

const Template: ComponentStory<typeof MapMarkerIcon> = function Template(args) {
  return <MapMarkerIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
