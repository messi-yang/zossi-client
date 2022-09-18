import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UnitPatternVo, MapSizeVo } from '@/valueObjects';
import { generateEmptyUnitMapWithMapSize } from '@/valueObjects/factories';

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
  unitMap: generateEmptyUnitMapWithMapSize(new MapSizeVo(30, 30)),
  unitSize: 15,
  unitPattern: new UnitPatternVo([[true]]),
};
