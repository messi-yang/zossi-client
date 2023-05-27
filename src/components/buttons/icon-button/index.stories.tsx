import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { IconButton } from '.';

export default {
  title: 'Button/IconButton',
  component: IconButton,
  argTypes: {
    text: {
      control: 'string',
    },
    onClick: { action: true },
  },
} as Meta<typeof IconButton>;

const Template: StoryFn<typeof IconButton> = function Template(args) {
  return <IconButton {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  icon: 'cross',
};
