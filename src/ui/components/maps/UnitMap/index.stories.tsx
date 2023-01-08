import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, ExtentVo, OffsetVo, UnitVo, UnitMapVo } from '@/models/valueObjects';

import UnitMap from '.';

export default {
  title: 'Map/UnitMap',
  component: UnitMap,
  argTypes: {},
} as ComponentMeta<typeof UnitMap>;

const Template: ComponentStory<typeof UnitMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { extent, unitMap } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!extent) {
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
const extentForPrimary = ExtentVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  extent: extentForPrimary,
  extentOffset: OffsetVo.new(0, 0),
  unitMap: UnitMapVo.newWithMapSize(extentForPrimary.getMapSize()),
  unitSize: 30,
  items: [],
  selectedItemId: null,
};
