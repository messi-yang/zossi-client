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
    from: { x: 0, y: 0 },
    to: { x: 2, y: 2 },
  },
  units: [
    [
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
    ],
    [
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
    ],
    [
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
      { alive: false, age: 0 },
    ],
  ],
  relatCoordsForRevival: [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ],
};
