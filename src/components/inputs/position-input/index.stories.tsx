import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { PositionInput } from '.';
import { PositionVo } from '@/models/world/common/position-vo';

export default {
  title: 'Input/PositionInput',
  component: PositionInput,
  argTypes: {
    onClick: { action: true },
  },
} as Meta<typeof PositionInput>;

type Stroy = StoryObj<typeof PositionInput>;

export const Primary: Stroy = {
  args: {
    value: PositionVo.create(0, 0),
  },
  render: (args) => {
    const [position, setPosition] = useState(args.value);

    return (
      <div className="w-36">
        <PositionInput
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
