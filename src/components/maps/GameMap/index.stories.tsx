import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateValueObject, AreaValueObject, OffsetValueObject, UnitPatternValueObject } from '@/valueObjects';
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
  const handleUnitsRevive = (
    coordinate: CoordinateValueObject,
    patternOffset: OffsetValueObject,
    pattern: UnitPatternValueObject
  ) => {
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
const areaForPrimary = new AreaValueObject(new CoordinateValueObject(3, 3), new CoordinateValueObject(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: new OffsetValueObject(0, 0),
  unitMap: generateEmptyUnitMapWithMapSize(generateMapSizeWithArea(areaForPrimary)),
  unitPattern: new UnitPatternValueObject([
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]),
};
