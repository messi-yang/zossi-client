import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, RangeVo, OffsetVo, UnitVo, UnitMapVo } from '@/models/valueObjects';

import UnitMap from '.';

export default {
  title: 'Map/UnitMap',
  component: UnitMap,
  argTypes: {},
} as ComponentMeta<typeof UnitMap>;

const Template: ComponentStory<typeof UnitMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { range, unitMap } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!range) {
      return;
    }
    if (!unitMap) {
      return;
    }

    const unitMatrix = unitMap.getUnitMatrix();
    unitMatrix[location.getX()][location.getY()] = UnitVo.new(null);

    updateArgs({
      unitMap: UnitMapVo.new(unitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <UnitMap {...args} onUnitClick={handleUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
const rangeForPrimary = RangeVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  range: rangeForPrimary,
  rangeOffset: OffsetVo.new(0, 0),
  unitMap: UnitMapVo.newWithMapSize(rangeForPrimary.getMapSize()),
  unitSize: 30,
  items: [],
  selectedItemId: null,
};
