import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateEntity } from '@/entities';

import GameRoomSideBar from '.';

export default {
  title: 'Sidebar/GameRoomSideBar',
  component: GameRoomSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameRoomSideBar>;

const Template: ComponentStory<typeof GameRoomSideBar> = function Template(
  args
) {
  const [, updateArgs] = useArgs();
  const handleRelativeCoordinatesUpdate = (
    relativeCoordinates: CoordinateEntity[]
  ) => {
    updateArgs({ relativeCoordinates });
  };

  return (
    <GameRoomSideBar
      {...args}
      onRelativeCoordinatesUpdate={handleRelativeCoordinatesUpdate}
    />
  );
};

export const Primary = Template.bind({});
Primary.args = {
  relativeCoordinates: [],
};
