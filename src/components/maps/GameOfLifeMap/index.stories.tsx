import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameOfLifeMap from '.';

export default {
  title: 'Map/GameOfLifeMap',
  component: GameOfLifeMap,
  argTypes: {},
} as ComponentMeta<typeof GameOfLifeMap>;

const Template: ComponentStory<typeof GameOfLifeMap> = function Template(args) {
  return (
    <div style={{ display: 'inline-flex', width: '300px', height: '300px' }}>
      <GameOfLifeMap {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  area: {
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  },
  units: [
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
  ],
  relativeCoordinates: [{ x: 0, y: 0 }],
};
