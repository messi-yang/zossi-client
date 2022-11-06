import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateValueObject, OffsetValueObject, UnitPatternValueObject } from '@/valueObjects';
import {
  createCoordinate,
  createArea,
  createOffset,
  createUnit,
  createUnitBlock,
  createUnitPattern,
  createDimensionByArea,
  createUnitBlockByDimension,
} from '@/valueObjects/factories';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { area, unitBlock } = args;
  const handleUnitsRevive = (
    coordinate: CoordinateValueObject,
    patternOffset: OffsetValueObject,
    pattern: UnitPatternValueObject
  ) => {
    if (!area) {
      return;
    }
    if (!unitBlock) {
      return;
    }

    const unitMatrix = unitBlock.getUnitMatrix();
    pattern.iterate((colIdx: number, rowIdx: number, alive: boolean) => {
      if (alive) {
        const adjustedX = coordinate.getX() - area.getFrom().getX() + colIdx + patternOffset.getX();
        const adjustedY = coordinate.getY() - area.getFrom().getY() + rowIdx + patternOffset.getY();
        unitMatrix[adjustedX][adjustedY] = createUnit(true);
      }
    });

    updateArgs({
      unitBlock: createUnitBlock(unitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <GameMap {...args} onUnitsRevive={handleUnitsRevive} />
    </div>
  );
};

export const Primary = Template.bind({});
const areaForPrimary = createArea(createCoordinate(3, 3), createCoordinate(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: createOffset(0, 0),
  unitBlock: createUnitBlockByDimension(createDimensionByArea(areaForPrimary)),
  unitPattern: createUnitPattern([
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]),
};
