import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateVo, AreaVo, OffsetVo, UnitPatternVo } from '@/valueObjects';
import { generateMapSizeWithArea, generateEmptyUnitMapWithMapSize } from '@/valueObjects/factories';

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
        newUnitMap?.setUnitAlive(adjustedX, adjustedY, true);
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

export const Primary = Template.bind({});
const areaForPrimary = new AreaVo(new CoordinateVo(3, 3), new CoordinateVo(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: new OffsetVo(0, 0),
  unitMap: generateEmptyUnitMapWithMapSize(generateMapSizeWithArea(areaForPrimary)),
  unitPattern: new UnitPatternVo([
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]),
};
