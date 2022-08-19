import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import type { UnitVO, CoordinateVO, AreaVO } from '@/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { displayedArea, unitMap } = args;
  const handleUnitsRevive = (coordinates: CoordinateVO[]) => {
    if (!displayedArea) {
      return;
    }
    const coordinateOffset = displayedArea.from;
    const newUnitMap = cloneDeep(unitMap);
    coordinates.forEach(({ x, y }) => {
      const adjustedX = x - coordinateOffset.x;
      const adjustedY = y - coordinateOffset.y;

      if (newUnitMap?.[adjustedX]?.[adjustedY] === undefined) {
        return;
      }

      newUnitMap[adjustedX][adjustedY].alive = true;
    });

    updateArgs({
      unitMap: newUnitMap,
    });
  };

  return (
    <div style={{ display: 'inline-flex', width: '140px', height: '140px' }}>
      <GameMap {...args} onUnitsRevive={handleUnitsRevive} />
    </div>
  );
};

function generateUnitMap(area: AreaVO) {
  const unitMap: UnitVO[][] = [];
  const width = area.to.x - area.from.x + 1;
  const height = area.to.y - area.from.y + 1;
  for (let x = 0; x < width; x += 1) {
    unitMap.push([]);
    for (let y = 0; y < height; y += 1) {
      unitMap[x].push({
        coordinate: { x: area.from.x + x, y: area.from.y + y },
        alive: false,
        age: 0,
      });
    }
  }
  return unitMap;
}

export const Primary = Template.bind({});
Primary.args = {
  displayedArea: {
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  },
  unitMap: generateUnitMap({
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  }),
  relativeCoordinates: [{ x: 0, y: 0 }],
};
