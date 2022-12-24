import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameRoomSideBar from '.';

export default {
  title: 'Sidebar/GameRoomSideBar',
  component: GameRoomSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameRoomSideBar>;

const Template: ComponentStory<typeof GameRoomSideBar> = function Template(args) {
  const { align } = args;

  return (
    <section className={[align === 'column' ? 'h-screen' : '', align === 'row' ? 'w-screen' : undefined].join(' ')}>
      <GameRoomSideBar {...args} />
    </section>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  align: 'column',
};
