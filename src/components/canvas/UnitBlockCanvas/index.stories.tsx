import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createDimension, createUnitPattern, createUnitBlockByDimension } from '@/valueObjects/factories';

import UnitBlockCanvas from '.';

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
  unitBlock: createUnitBlockByDimension(createDimension(30, 30)),
  unitSize: 15,
  unitPattern: createUnitPattern([[true]]),
};
