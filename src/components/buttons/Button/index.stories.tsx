import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '.';

export default {
  title: 'Button/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'string',
    },
    onClick: { action: true },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = function Template(args) {
  return <Button {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  text: 'Click',
};
