import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { UnitPatternValueObject } from '@/models/valueObjects';
import { createUnitPattern } from '@/models/valueObjects/factories';

import UnitPatternEditor from '.';

export default {
  title: 'Editor/UnitPatternEditor',
  component: UnitPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitPatternEditor>;

const Template: ComponentStory<typeof UnitPatternEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleUnitPatternUpdate = (unitPattern: UnitPatternValueObject) => {
    updateArgs({
      unitPattern,
    });
  };

  return (
    <div className="w-32 h-32 inline-flex">
      <UnitPatternEditor {...args} onUpdate={handleUnitPatternUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  unitPattern: createUnitPattern([
    [false, false, false, false, false],
    [false, true, true, true, false],
    [false, true, false, true, false],
    [false, true, true, true, false],
    [false, false, false, false, false],
  ]),
  unitSize: 40,
};
