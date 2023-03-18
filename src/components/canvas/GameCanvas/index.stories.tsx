import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameCanvas from '.';
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
  units: [UnitAgg.newMockupUnit(), UnitAgg.newMockupUnit(), UnitAgg.newMockupUnit()],
  items: [item],
};
