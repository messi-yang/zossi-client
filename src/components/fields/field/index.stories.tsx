import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { Field } from '.';
import { Input } from '@/components/inputs/input';

export default {
  title: 'Field/Field',
  component: Field,
  argTypes: {
    text: {
      control: 'text',
    },
    onClick: { action: true },
  },
} as Meta<typeof Field>;

const Template: StoryFn<typeof Field> = function Template(args) {
  const [value, setValue] = useState('');

  return (
    <Field {...args}>
      <Input value={value} onInput={setValue} />
    </Field>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'First name',
  description: 'please enter your first name',
};
