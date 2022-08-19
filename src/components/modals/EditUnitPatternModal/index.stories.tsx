import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EditUnitPatternModal from '.';

export default {
  title: 'Modal/EditUnitPatternModal',
  component: EditUnitPatternModal,
  argTypes: {},
} as ComponentMeta<typeof EditUnitPatternModal>;

const Template: ComponentStory<typeof EditUnitPatternModal> = function Template(args) {
  return <EditUnitPatternModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  unitPattern: [
    [null, true, null],
    [true, null, true],
    [null, true, null],
  ],
};
