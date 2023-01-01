import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateVo, AreaVo, OffsetVo, UnitVo, UnitBlockVo } from '@/models/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { area, unitBlock } = args;
  const handleUnitClick = (coordinate: CoordinateVo) => {
    if (!area) {
      return;
    }
    if (!unitBlock) {
      return;
    }

    const unitMatrix = unitBlock.getUnitMatrix();
    unitMatrix[coordinate.getX()][coordinate.getY()] = UnitVo.new(null);

    updateArgs({
      unitBlock: UnitBlockVo.new(unitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <GameMap {...args} onUnitClick={handleUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
const areaForPrimary = AreaVo.new(CoordinateVo.new(3, 3), CoordinateVo.new(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: OffsetVo.new(0, 0),
  unitBlock: UnitBlockVo.newWithDimension(areaForPrimary.getDimension()),
};
