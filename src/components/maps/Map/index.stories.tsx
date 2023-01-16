import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, BoundVo, OffsetVo, UnitVo, MapVo, ViewVo } from '@/models/valueObjects';

import Map from '.';

export default {
  title: 'Map/Map',
  component: Map,
  argTypes: {},
} as ComponentMeta<typeof Map>;

const Template: ComponentStory<typeof Map> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { view } = args;
  const handleUnitClick = (location: LocationVo) => {
    if (!view) {
      return;
    }

    const unitMatrix = view.getMap().getUnitMatrix();
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
  view: ViewVo.new(boundForPrimary, MapVo.newWithMapSize(boundForPrimary.getSize())),
  viewOffset: OffsetVo.new(0, 0),
  unitSize: 30,
  items: [],
  selectedItemId: null,
};
