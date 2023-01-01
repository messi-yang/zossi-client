import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createUnitBlockByDimension } from '@/models/valueObjects/factories';

import UnitBlockCanvas from '.';
import { DimensionVo } from '@/models/valueObjects';

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
  unitBlock: createUnitBlockByDimension(DimensionVo.new(30, 30)),
  unitSize: 15,
};
