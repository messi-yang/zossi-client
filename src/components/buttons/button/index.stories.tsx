import React from 'react';
import Image from 'next/image';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '.';

export default {
  title: 'Button/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'string',
    },
    onClick: { action: true },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = function Template(args) {
  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1683009427666-340595e57e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60)',
      }}
    >
      <Button {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  text: 'Continue with',
  rightChild: <Image src="/assets/images/third-party/google.png" alt="google" width={71} height={24} />,
};
