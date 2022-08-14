import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EditLiveUnitMapModal from '.';

export default {
  title: 'Modal/EditLiveUnitMapModal',
  component: EditLiveUnitMapModal,
  argTypes: {},
} as ComponentMeta<typeof EditLiveUnitMapModal>;

const Template: ComponentStory<typeof EditLiveUnitMapModal> = function Template(args) {
  return <EditLiveUnitMapModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  liveUnitMap: [
    [null, true, null],
    [true, null, true],
    [null, true, null],
  ],
};
