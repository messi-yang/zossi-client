import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitsPatternEditor from '.';

export default {
  title: 'Editor/UnitsPatternEditor',
  component: UnitsPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitsPatternEditor>;

const Template: ComponentStory<typeof UnitsPatternEditor> = function Template(
  args
) {
  return (
    <div style={{ display: 'inline-flex' }}>
      <UnitsPatternEditor {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  pattern: [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ],
};
