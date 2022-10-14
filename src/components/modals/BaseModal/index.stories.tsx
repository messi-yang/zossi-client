import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import BaseModal from '.';

export default {
  title: 'Modal/BaseModal',
  component: BaseModal,
  argTypes: {},
} as ComponentMeta<typeof BaseModal>;

const Template: ComponentStory<typeof BaseModal> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleBackgroundClick = () => {
    updateArgs({ opened: false });
  };

  return (
    <BaseModal {...args} onBackgroundClick={handleBackgroundClick}>
      <div className="w-full h-full bg-white">This white section is your fully customisable section.</div>
    </BaseModal>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  height: 300,
};
