import React from 'react';
import Head from 'next/head';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Text from '.';

export default {
  title: 'Square/Text',
  component: Text,
  argTypes: {},
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = function Template(args) {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet" />
      </Head>
      <Text {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  copy: 'Hello World',
};
