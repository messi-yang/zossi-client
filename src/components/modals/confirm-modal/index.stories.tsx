import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { ConfirmModal } from '.';

export default {
  title: 'Modal/ConfirmModal',
  component: ConfirmModal,
  argTypes: {},
} as Meta<typeof ConfirmModal>;

const Template: StoryFn<typeof ConfirmModal> = function Template(args) {
  return <ConfirmModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  message: 'Hello~~',
};
