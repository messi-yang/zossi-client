import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { CoordinateEntity } from '@/entities';

import RelativeCoordinatesEditor from '.';

export default {
  title: 'Editor/RelativeCoordinatesEditor',
  component: RelativeCoordinatesEditor,
  argTypes: {},
} as ComponentMeta<typeof RelativeCoordinatesEditor>;

const Template: ComponentStory<typeof RelativeCoordinatesEditor> =
  function Template(args) {
    const [, updateArgs] = useArgs();
    const handleRelativeCoordinatesUpdate = (
      newRelativeCoordinates: CoordinateEntity[]
    ) => {
      updateArgs({
        relativeCoordinates: newRelativeCoordinates,
      });
    };

    return (
      <div style={{ display: 'inline-flex' }}>
        <RelativeCoordinatesEditor
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
