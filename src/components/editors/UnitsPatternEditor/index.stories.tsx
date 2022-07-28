import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import UnitsPatternEditor from '.';
import type { Coordinate } from '.';

export default {
  title: 'Editor/UnitsPatternEditor',
  component: UnitsPatternEditor,
  argTypes: {},
} as ComponentMeta<typeof UnitsPatternEditor>;

const Template: ComponentStory<typeof UnitsPatternEditor> = function Template(
  args
) {
  const [, updateArgs] = useArgs();
  const handleRelativeCoordinatesUpdate = (
    newRelativeCoordinates: Coordinate[]
  ) => {
    updateArgs({
      relativeCoordinates: newRelativeCoordinates,
    });
  };

  return (
    <div style={{ display: 'inline-flex' }}>
      <UnitsPatternEditor
        {...args}
        onUpdate={handleRelativeCoordinatesUpdate}
      />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  relativeCoordinates: [{ x: 0, y: 0 }],
  relativeCoordinateOffset: { x: -2, y: -2 },
  width: 5,
  height: 5,
};
