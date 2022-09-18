import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateVO, AreaVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
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
  const handleUnitsRevive = (coordinate: CoordinateVO, patternOffset: OffsetVO, pattern: UnitPatternVO) => {
    if (!area) {
      return;
    }

    const newUnitMap = cloneDeep(unitMap);
    pattern.iterate((colIdx: number, rowIdx: number, alive: boolean) => {
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
const areaForPrimary = new AreaVO(new CoordinateVO(3, 3), new CoordinateVO(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: new OffsetVO(0, 0),
  unitMap: generateEmptyUnitMapWithMapSize(generateMapSizeWithArea(areaForPrimary)),
  unitPattern: new UnitPatternVO([
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]),
};
