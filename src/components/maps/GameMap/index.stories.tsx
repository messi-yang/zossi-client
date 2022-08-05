import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import type { UnitEntity } from '@/entities';

import GameMap from '.';
import type { Coordinate, Area } from '.';

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
    <div style={{ display: 'inline-flex', width: '140px', height: '140px' }}>
      <GameMap {...args} onUnitsRevive={handleUnitsRevive} />
    </div>
  );
};

function generateMockupUnits(area: Area) {
  const units: UnitEntity[][] = [];
  const width = area.to.x - area.from.x + 1;
  const height = area.to.y - area.from.y + 1;
  for (let x = 0; x < width; x += 1) {
    units.push([]);
    for (let y = 0; y < height; y += 1) {
      units[x].push({
        coordinate: { x: area.from.x + x, y: area.from.y + y },
        alive: false,
        age: 0,
      });
    }
  }
  return units;
}

export const Primary = Template.bind({});
Primary.args = {
  area: {
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  },
  units: generateMockupUnits({
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  }),
  relativeCoordinates: [{ x: 0, y: 0 }],
};
