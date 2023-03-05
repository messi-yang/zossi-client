import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCanvas from '.';
import { DirectionVo, PositionVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';

export default {
  title: 'Canvas/GameCanvas',
  component: GameCanvas,
  argTypes: {},
} as ComponentMeta<typeof GameCanvas>;

const Template: ComponentStory<typeof GameCanvas> = function Template(args) {
  return (
    <div className="w-screen h-screen">
      <GameCanvas {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
const item = ItemAgg.new({
  id: '414b5703-91d1-42fc-a007-36dd8f25e329',
  name: 'Hello',
  traversable: false,
  assetSrc: 'https://avatars.dicebear.com/api/pixel-art/1.svg',
  modelSrc: 'placeholder-item.png',
});
Primary.args = {
  players: [
    PlayerAgg.new({
      id: '1',
      name: 'Mark',
      position: PositionVo.new(0, 0),
      direction: DirectionVo.new(2),
    }),
    PlayerAgg.new({
      id: '1',
      name: 'Mark',
      position: PositionVo.new(2, 2),
      direction: DirectionVo.new(2),
    }),
    PlayerAgg.new({
      id: '1',
      name: 'Mark',
      position: PositionVo.new(4, 4),
      direction: DirectionVo.new(2),
    }),
    PlayerAgg.new({
      id: '1',
      name: 'Mark',
      position: PositionVo.new(19, 19),
      direction: DirectionVo.new(2),
    }),
  ],
  units: [
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 0)),
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 1)),
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 2)),
  ],
  myPlayerPosition: PositionVo.new(4, 4),
  items: [item],
};
