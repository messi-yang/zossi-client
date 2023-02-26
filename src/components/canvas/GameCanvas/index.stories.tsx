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
  id: 1,
  name: 'Hello',
  traversable: false,
  assetSrc: 'https://avatars.dicebear.com/api/pixel-art/1.svg',
  modelSrc: 'placeholder-item.png',
});
item.loadAsset();
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
    UnitAgg.new(1, PositionVo.new(0, 0)),
    UnitAgg.new(1, PositionVo.new(0, 1)),
    UnitAgg.new(1, PositionVo.new(0, 2)),
  ],
  cameraPosition: PositionVo.new(4, 4),
  items: [item],
};
