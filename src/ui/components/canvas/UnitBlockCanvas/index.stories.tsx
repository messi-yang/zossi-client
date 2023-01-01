import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitBlockCanvas from '.';
import { DimensionVo, UnitBlockVo } from '@/models/valueObjects';

export default {
  title: 'Canvas/UnitBlockCanvas',
  component: UnitBlockCanvas,
  argTypes: {},
} as ComponentMeta<typeof UnitBlockCanvas>;

const Template: ComponentStory<typeof UnitBlockCanvas> = function Template(args) {
  return <UnitBlockCanvas {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  unitBlock: UnitBlockVo.newWithDimension(DimensionVo.new(30, 30)),
  unitSize: 15,
};
