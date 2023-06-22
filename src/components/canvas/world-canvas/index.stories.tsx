import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { WorldCanvas } from '.';
import { ItemModel, UnitModel, PlayerModel } from '@/models';

export default {
  title: 'Canvas/WorldCanvas',
  component: WorldCanvas,
  argTypes: {},
} as Meta<typeof WorldCanvas>;

const Template: StoryFn<typeof WorldCanvas> = function Template(args) {
  return (
    <div className="w-screen h-screen">
      <WorldCanvas {...args} />
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
