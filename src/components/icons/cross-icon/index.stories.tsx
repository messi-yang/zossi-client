import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CrossIcon } from '.';

export default {
  title: 'Icon/CrossIcon',
  component: CrossIcon,
  argTypes: {},
} as ComponentMeta<typeof CrossIcon>;

const Template: ComponentStory<typeof CrossIcon> = function Template(args) {
  return <CrossIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
