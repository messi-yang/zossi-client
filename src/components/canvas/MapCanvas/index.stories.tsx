import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MapCanvas from '.';
import { CameraVo, ViewVo, SizeVo, OffsetVo, MapVo, BoundVo, LocationVo } from '@/models/valueObjects';
import { PlayerEntity } from '@/models/entities';

export default {
  title: 'Canvas/MapCanvas',
  component: MapCanvas,
  argTypes: {},
} as ComponentMeta<typeof MapCanvas>;

const Template: ComponentStory<typeof MapCanvas> = function Template(args) {
  return <MapCanvas {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  players: [
    PlayerEntity.new({
      id: '1',
      name: 'Mark',
      camera: CameraVo.new(LocationVo.new(0, 0)),
      location: LocationVo.new(0, 0),
    }),
  ],
  view: ViewVo.new(BoundVo.new(LocationVo.new(0, 0), LocationVo.new(19, 19)), MapVo.newWithMapSize(SizeVo.new(20, 20))),
  viewOffset: OffsetVo.new(0, 0),
  unitSize: 25,
  items: [],
  selectedItemId: null,
};
