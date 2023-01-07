import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, MapRangeVo, OffsetVo, MapUnitVo, UnitMapVo } from '@/models/valueObjects';

import UnitMap from '.';

export default {
  title: 'Map/UnitMap',
  component: UnitMap,
  argTypes: {},
} as ComponentMeta<typeof UnitMap>;

const Template: ComponentStory<typeof UnitMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { mapRange, unitMap } = args;
  const handleMapUnitClick = (location: LocationVo) => {
    if (!mapRange) {
      return;
    }
    if (!unitMap) {
      return;
    }

    const mapUnitMatrix = unitMap.getMapUnitMatrix();
    mapUnitMatrix[location.getX()][location.getY()] = MapUnitVo.new(null);

    updateArgs({
      unitMap: UnitMapVo.new(mapUnitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <UnitMap {...args} onMapUnitClick={handleMapUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
const mapRangeForPrimary = MapRangeVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  mapRange: mapRangeForPrimary,
  mapRangeOffset: OffsetVo.new(0, 0),
  unitMap: UnitMapVo.newWithMapSize(mapRangeForPrimary.getMapSize()),
  mapUnitSize: 30,
  items: [],
  selectedItemId: null,
};
