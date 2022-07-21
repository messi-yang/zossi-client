import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitPatternEditor from '.';

export default {
  title: 'Editor/UnitPatternEditor',
  component: UnitPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitPatternEditor>;

const Template: ComponentStory<typeof UnitPatternEditor> = function Template(
  args
) {
  return (
    <div style={{ display: 'inline-flex' }}>
      <UnitPatternEditor {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  booleanMatrix: [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ],
};
