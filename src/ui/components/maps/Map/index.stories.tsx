import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, RangeVo, OffsetVo, UnitVo, MapVo } from '@/models/valueObjects';

import Map from '.';

export default {
  title: 'Map/Map',
  component: Map,
  argTypes: {},
} as ComponentMeta<typeof Map>;

const Template: ComponentStory<typeof Map> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { range, map } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!range) {
      return;
    }
    if (!map) {
      return;
    }

    const unitMatrix = map.getUnitMatrix();
    unitMatrix[location.getX()][location.getY()] = UnitVo.new(null);

    updateArgs({
      map: MapVo.new(unitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <Map {...args} onUnitClick={handleUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
const rangeForPrimary = RangeVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  range: rangeForPrimary,
  rangeOffset: OffsetVo.new(0, 0),
  map: MapVo.newWithMapSize(rangeForPrimary.getMapSize()),
  unitSize: 30,
  items: [],
  selectedItemId: null,
};
