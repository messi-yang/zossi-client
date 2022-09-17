import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { UnitVo, CoordinateVo, AreaVo, OffsetVo, UnitPatternVo } from '@/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { area, unitMap } = args;
  const handleUnitsRevive = (coordinate: CoordinateVo, patternOffset: OffsetVo, pattern: UnitPatternVo) => {
    if (!area) {
      return;
    }

    const newUnitMap = cloneDeep(unitMap);
    pattern.iterate((colIdx, rowIdx, alive) => {
      if (alive) {
        const adjustedX = coordinate.getX() - area.getFrom().getX() + colIdx + patternOffset.getX();
        const adjustedY = coordinate.getY() - area.getFrom().getY() + rowIdx + patternOffset.getY();
        if (newUnitMap?.[adjustedX]?.[adjustedY]) {
          newUnitMap[adjustedX][adjustedY].setAlive(true);
        }
      }
    });

    updateArgs({
      unitMap: newUnitMap,
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <GameMap {...args} onUnitsRevive={handleUnitsRevive} />
    </div>
  );
};

function generateUnitMap(area: AreaVo) {
  const unitMap: UnitVo[][] = [];
  const width = area.getWidth();
  const height = area.getHeight();
  for (let x = 0; x < width; x += 1) {
    unitMap.push([]);
    for (let y = 0; y < height; y += 1) {
      unitMap[x].push(new UnitVo(false, 0));
    }
  }
  return unitMap;
}

export const Primary = Template.bind({});
Primary.args = {
  area: new AreaVo(new CoordinateVo(3, 3), new CoordinateVo(9, 9)),
  areaOffset: new OffsetVo(0, 0),
  unitMap: generateUnitMap(new AreaVo(new CoordinateVo(3, 3), new CoordinateVo(9, 9))),
  unitPattern: new UnitPatternVo([
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]),
};
