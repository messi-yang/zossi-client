import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameMapCanvas from '.';
import { MapSizeVo, GameMapVo } from '@/models/valueObjects';

export default {
  title: 'Canvas/GameMapCanvas',
  component: GameMapCanvas,
  argTypes: {},
} as ComponentMeta<typeof GameMapCanvas>;

const Template: ComponentStory<typeof GameMapCanvas> = function Template(args) {
  return <GameMapCanvas {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  gameMap: GameMapVo.newWithMapSize(MapSizeVo.new(30, 30)),
  mapUnitSize: 15,
  items: [],
};
