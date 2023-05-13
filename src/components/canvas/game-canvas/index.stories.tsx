import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GameCanvas } from '.';
import { ItemModel, UnitModel, PlayerModel } from '@/models';

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
const item = ItemModel.newMockupItem();
Primary.args = {
  myPlayer: PlayerModel.newMockupPlayer(),
  otherPlayers: [
    PlayerModel.newMockupPlayer(),
    PlayerModel.newMockupPlayer(),
    PlayerModel.newMockupPlayer(),
    PlayerModel.newMockupPlayer(),
  ],
  units: [UnitModel.newMockupUnit(), UnitModel.newMockupUnit(), UnitModel.newMockupUnit()],
  items: [item],
};
