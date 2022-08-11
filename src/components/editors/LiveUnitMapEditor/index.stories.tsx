import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import LiveUnitMapEditor from '.';
import type { LiveUnitMapEntity } from '@/entities/';

export default {
  title: 'Editor/LiveUnitMapEditor',
  component: LiveUnitMapEditor,
  argTypes: {},
} as ComponentMeta<typeof LiveUnitMapEditor>;

const Template: ComponentStory<typeof LiveUnitMapEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleLiveUnitMapUpdate = (liveUnitMap: LiveUnitMapEntity) => {
    updateArgs({
      liveUnitMap,
    });
  };

  return (
    <div style={{ display: 'inline-flex' }}>
      <LiveUnitMapEditor {...args} onUpdate={handleLiveUnitMapUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  liveUnitMap: [
    [true, true, true],
    [true, null, true],
    [true, true, true],
  ],
};
