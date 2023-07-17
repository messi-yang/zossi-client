import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { MessageModal } from '.';

export default {
  title: 'Modal/MessageModal',
  component: MessageModal,
  argTypes: {},
} as Meta<typeof MessageModal>;

const Template: StoryFn<typeof MessageModal> = function Template(args) {
  return <MessageModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  message: 'Hello~~',
  buttonCopy: 'Confirm',
};
