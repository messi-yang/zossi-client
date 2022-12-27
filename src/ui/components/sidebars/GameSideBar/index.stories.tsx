import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameSideBar from '.';

export default {
  title: 'Sidebar/GameSideBar',
  component: GameSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameSideBar>;

const Template: ComponentStory<typeof GameSideBar> = function Template(args) {
  const { align } = args;

  return (
    <section className={[align === 'column' ? 'h-screen' : '', align === 'row' ? 'w-screen' : undefined].join(' ')}>
      <GameSideBar {...args} />
    </section>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  align: 'column',
};
