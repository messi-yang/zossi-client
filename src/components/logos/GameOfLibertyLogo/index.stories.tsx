import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import GameOfLibertyLogo from '.';

export default {
  title: 'Logo/GameOfLibertyLogo',
  component: GameOfLibertyLogo,
  argTypes: {},
} as ComponentMeta<typeof GameOfLibertyLogo>;

const Template: ComponentStory<typeof GameOfLibertyLogo> = function Template() {
  return <GameOfLibertyLogo />;
};

export const Primary = Template.bind({});
Primary.args = {};
