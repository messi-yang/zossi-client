import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, BoundVo, OffsetVo, UnitVo, MapVo } from '@/models/valueObjects';

import Map from '.';

export default {
  title: 'Map/Map',
  component: Map,
  argTypes: {},
} as ComponentMeta<typeof Map>;

const Template: ComponentStory<typeof Map> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { bound, map } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!bound) {
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
const boundForPrimary = BoundVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  bound: boundForPrimary,
  boundOffset: OffsetVo.new(0, 0),
  map: MapVo.newWithDimension(boundForPrimary.getDimension()),
  unitSize: 30,
  items: [],
  selectedItemId: null,
};
