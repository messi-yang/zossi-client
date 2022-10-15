import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createUnitPattern } from '@/valueObjects/factories';

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
  unitPattern: createUnitPattern([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, true, true, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ]),
};
