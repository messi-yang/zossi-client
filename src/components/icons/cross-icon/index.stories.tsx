import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { CrossIcon } from '.';

export default {
  title: 'Icon/CrossIcon',
  component: CrossIcon,
  argTypes: {},
} as Meta<typeof CrossIcon>;

const Template: StoryFn<typeof CrossIcon> = function Template(args) {
  return <CrossIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
