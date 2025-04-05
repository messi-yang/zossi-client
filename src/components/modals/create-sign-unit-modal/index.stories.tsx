import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { CreateSignUnitModal } from '.';

export default {
  title: 'Modal/CreateSignUnitModal',
  component: CreateSignUnitModal,
  argTypes: {},
} as Meta<typeof CreateSignUnitModal>;

const Template: StoryFn<typeof CreateSignUnitModal> = function Template(args) {
  return <CreateSignUnitModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
};
