import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCanvas from '.';
import { PositionVo } from '@/models/valueObjects';
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
const item = ItemAgg.newMockupItem();
Primary.args = {
  myPlayer: PlayerAgg.newMockupPlayer(),
  otherPlayers: [
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
    PlayerAgg.newMockupPlayer(),
  ],
  units: [
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 0)),
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 1)),
    UnitAgg.new('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 2)),
  ],
  items: [item],
};
