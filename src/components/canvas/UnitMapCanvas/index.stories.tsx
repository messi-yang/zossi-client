import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createDimension, createUnitPattern, createUnitMapByDimension } from '@/valueObjects/factories';

import UnitMapCanvas from '.';

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
  unitMap: createUnitMapByDimension(createDimension(30, 30)),
  unitSize: 15,
  unitPattern: createUnitPattern([[true]]),
};
