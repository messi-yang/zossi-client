import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import UnitPatternEditor from '.';
import type { UnitPatternVO } from '@/valueObjects';

export default {
  title: 'Editor/UnitPatternEditor',
  component: UnitPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitPatternEditor>;

const Template: ComponentStory<typeof UnitPatternEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleUnitPatternUpdate = (unitPattern: UnitPatternVO) => {
    updateArgs({
      unitPattern,
    });
  };

  return (
    <div style={{ width: '120px', height: '120px', display: 'inline-flex' }}>
      <UnitPatternEditor {...args} onUpdate={handleUnitPatternUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  unitPattern: [
    [true, true, true],
    [true, null, true],
    [true, true, true],
  ],
};
