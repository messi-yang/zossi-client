import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { BigLogo } from '.';

export default {
  title: 'Logo/BigLogo',
  component: BigLogo,
  argTypes: {},
} as ComponentMeta<typeof BigLogo>;

const Template: ComponentStory<typeof BigLogo> = function Template() {
  return <BigLogo />;
};

export const Primary = Template.bind({});
Primary.args = {};
