import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitMapCanvas from '.';
import { MapSizeVo, UnitMapVo } from '@/models/valueObjects';

export default {
  title: 'Canvas/UnitMapCanvas',
  component: UnitMapCanvas,
  argTypes: {},
} as ComponentMeta<typeof UnitMapCanvas>;

const Template: ComponentStory<typeof UnitMapCanvas> = function Template(args) {
  return <UnitMapCanvas {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  unitMap: UnitMapVo.newWithMapSize(MapSizeVo.new(30, 30)),
  unitSize: 15,
  items: [],
  selectedItemId: null,
};
