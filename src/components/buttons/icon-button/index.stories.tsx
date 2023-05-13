import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

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
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = function Template(args) {
  return <IconButton {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  icon: 'cross',
};
