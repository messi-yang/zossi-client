import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MapCanvas from '.';
import { DimensionVo, MapVo } from '@/models/valueObjects';

export default {
  title: 'Canvas/MapCanvas',
  component: MapCanvas,
  argTypes: {},
} as ComponentMeta<typeof MapCanvas>;

const Template: ComponentStory<typeof MapCanvas> = function Template(args) {
  return <MapCanvas {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  map: MapVo.newWithDimension(DimensionVo.new(30, 30)),
  unitSize: 15,
  items: [],
  selectedItemId: null,
};
