import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { Text } from '.';

export default {
  title: 'Square/Text',
  component: Text,
  argTypes: {},
} as Meta<typeof Text>;

const Template: StoryFn<typeof Text> = function Template(args) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Text {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  children: 'Hello World',
};
