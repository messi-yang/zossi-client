import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, AreaVo, OffsetVo, UnitVo, UnitBlockVo } from '@/models/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { area, unitBlock } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!area) {
      return;
    }
    if (!unitBlock) {
      return;
    }

    const unitMatrix = unitBlock.getUnitMatrix();
    unitMatrix[location.getX()][location.getY()] = UnitVo.new(null);

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
const areaForPrimary = AreaVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  area: areaForPrimary,
  areaOffset: OffsetVo.new(0, 0),
  unitBlock: UnitBlockVo.newWithDimension(areaForPrimary.getDimension()),
};
