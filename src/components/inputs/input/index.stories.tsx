import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import { Input } from '.';

export default {
  title: 'Input/Input',
  component: Input,
  argTypes: {
    text: {
      control: 'string',
    },
    onClick: { action: true },
  },
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = function Template(args) {
  const [, updateArgs] = useArgs();

  const handleInput = (newValue: string) => {
    updateArgs({
      value: newValue,
    });
  };

  return (
    <div className="w-[50vw] h-screen flex justify-center items-center bg-no-repeat bg-cover">
      <Input {...args} onInput={handleInput} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  value: '',
  placeholder: 'please type something',
};
