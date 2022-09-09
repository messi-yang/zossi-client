import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import type { UnitVO } from '@/valueObjects';

import UnitMapCanvas from '.';

export default {
  title: 'Canvas/UnitMapCanvas',
  component: UnitMapCanvas,
  argTypes: {},
} as ComponentMeta<typeof UnitMapCanvas>;

const Template: ComponentStory<typeof UnitMapCanvas> = function Template(args) {
  return <UnitMapCanvas {...args} />;
};

function generateUnitMap(size: number): UnitVO[][] {
  const unitMap: UnitVO[][] = [];
  for (let x = 0; x < size; x += 1) {
    unitMap.push([]);
    for (let y = 0; y < size; y += 1) {
      unitMap[x].push({
        alive: Math.random() * 2 > 1,
        age: 0,
      });
    }
  }
  return unitMap;
}

export const Primary = Template.bind({});
Primary.args = {
  unitMap: generateUnitMap(30),
  unitSize: 15,
};
