import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { DimensionInput } from '.';
import { DimensionVo } from '@/models/world/common/dimension-vo';

export default {
  title: 'Input/DimensionInput',
  component: DimensionInput,
  argTypes: {
    onClick: { action: true },
  },
} as Meta<typeof DimensionInput>;

type Stroy = StoryObj<typeof DimensionInput>;

export const Primary: Stroy = {
  args: {
    value: DimensionVo.create(0, 0),
  },
  render: (args) => {
    const [position, setPosition] = useState(args.value);

    return (
      <div className="w-48">
        <DimensionInput
          value={position}
          onInput={(val) => {
            setPosition(val);
            args.onInput?.(val);
          }}
        />
      </div>
    );
  },
};
