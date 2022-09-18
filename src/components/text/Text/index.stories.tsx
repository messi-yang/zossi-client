import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Text from '.';

export default {
  title: 'Square/Text',
  component: Text,
  argTypes: {},
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = function Template(args) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Text {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  copy: 'Hello World',
};
