import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateVO } from '@/valueObjects';

import GameRoomSideBar from '.';

export default {
  title: 'Sidebar/GameRoomSideBar',
  component: GameRoomSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameRoomSideBar>;

const Template: ComponentStory<typeof GameRoomSideBar> = function Template(args) {
  const { align } = args;
  const [, updateArgs] = useArgs();
  const handleRelativeCoordinatesUpdate = (relativeCoordinates: CoordinateVO[]) => {
    updateArgs({ relativeCoordinates });
  };

  return (
    <section
      style={{
        height: align === 'column' ? '100vh' : undefined,
        width: align === 'row' ? '100vw' : undefined,
      }}
    >
      <GameRoomSideBar {...args} onRelativeCoordinatesUpdate={handleRelativeCoordinatesUpdate} />
    </section>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  align: 'column',
  relativeCoordinates: [],
};
