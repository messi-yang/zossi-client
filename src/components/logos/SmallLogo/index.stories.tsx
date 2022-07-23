import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SmallLogo from '.';

export default {
  title: 'Logo/SmallLogo',
  component: SmallLogo,
  argTypes: {},
} as ComponentMeta<typeof SmallLogo>;

const Template: ComponentStory<typeof SmallLogo> = function Template() {
  return <SmallLogo />;
};

export const Primary = Template.bind({});
Primary.args = {};
