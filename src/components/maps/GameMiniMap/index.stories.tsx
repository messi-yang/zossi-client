import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LocationVo, SizeVo, BoundVo } from '@/models/valueObjects';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  return <GameMiniMap {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  mapSize: SizeVo.new(300, 300),
  bound: BoundVo.new(LocationVo.new(0, 0), LocationVo.new(30, 30)),
};
