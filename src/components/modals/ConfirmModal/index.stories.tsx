import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ConfirmModal from '.';

export default {
  title: 'Modal/ConfirmModal',
  component: ConfirmModal,
  argTypes: {},
} as ComponentMeta<typeof ConfirmModal>;

const Template: ComponentStory<typeof ConfirmModal> = function Template(args) {
  return <ConfirmModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  buttonCopy: 'Confirm',
};
