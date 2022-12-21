import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createUnitPattern } from '@/models/valueObjects/factories';

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
  unitPattern: createUnitPattern([
    [false, true, false],
    [true, false, true],
    [false, true, false],
  ]),
};
