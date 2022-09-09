import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import type { UnitVO, CoordinateVO, AreaVO, OffsetVO, UnitPatternVO } from '@/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { zoomedArea, unitMap } = args;
  const handleUnitsRevive = (coordinate: CoordinateVO, patternOffset: OffsetVO, pattern: UnitPatternVO) => {
    if (!zoomedArea) {
      return;
    }

    const newUnitMap = cloneDeep(unitMap);
    pattern.forEach((patternCol, colIdx) => {
      patternCol.forEach((isTruthy, rowIdx) => {
        if (isTruthy) {
          const adjustedX = coordinate.x - zoomedArea.from.x + colIdx + patternOffset.x;
          const adjustedY = coordinate.y - zoomedArea.from.y + rowIdx + patternOffset.y;
          if (newUnitMap?.[adjustedX]?.[adjustedY]) {
            newUnitMap[adjustedX][adjustedY].alive = true;
          }
        }
      });
    });

    updateArgs({
      unitMap: newUnitMap,
    });
  };

  return (
    <div style={{ display: 'inline-flex', width: '105px', height: '105px' }}>
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
        alive: false,
        age: 0,
      });
    }
  }
  return unitMap;
}

export const Primary = Template.bind({});
Primary.args = {
  zoomedArea: {
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  },
  zoomedAreaOffset: {
    x: 0,
    y: 0,
  },
  unitMap: generateUnitMap({
    from: { x: 3, y: 3 },
    to: { x: 9, y: 9 },
  }),
  unitPattern: [
    [null, null, null, null, null],
    [null, null, true, null, null],
    [null, null, true, null, null],
    [null, null, true, null, null],
    [null, null, null, null, null],
  ],
};
