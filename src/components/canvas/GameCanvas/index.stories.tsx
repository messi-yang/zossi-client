import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCanvas from '.';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import { BoundVo, PositionVo } from '@/models/valueObjects';

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
const item = ItemAgg.newMockupItem();
Primary.args = {
  myPlayer: PlayerAgg.newMockupPlayer(),
  otherPlayers: [
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
  ],
  units: [UnitAgg.newMockupUnit(), UnitAgg.newMockupUnit(), UnitAgg.newMockupUnit()],
  items: [item],
  visionBound: BoundVo.new(PositionVo.new(-10, -10), PositionVo.new(10, 10)),
};
