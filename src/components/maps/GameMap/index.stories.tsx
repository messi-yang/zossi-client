import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import GameMap from '.';
import type { Coordinate } from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { area, units } = args;
  const handleUnitsRevive = (coordinates: Coordinate[]) => {
    const coordinateOffset = area.from;
    const newUnits = cloneDeep(units);
    coordinates.forEach(({ x, y }) => {
      const adjustedX = x - coordinateOffset.x;
      const adjustedY = y - coordinateOffset.y;

      if (newUnits?.[adjustedX]?.[adjustedY] === undefined) {
        return;
      }

      newUnits[adjustedX][adjustedY].alive = true;
    });

    updateArgs({
      units: newUnits,
    });
  };

  return (
    <div style={{ display: 'inline-flex', width: '300px', height: '300px' }}>
      <GameMap {...args} onUnitsRevive={handleUnitsRevive} />
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
