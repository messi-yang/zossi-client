import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { NumberInput } from '.';

export default {
  title: 'Input/NumberInput',
  component: NumberInput,
  argTypes: {
    onClick: { action: true },
  },
} as Meta<typeof NumberInput>;

type Stroy = StoryObj<typeof NumberInput>;

export const Primary: Stroy = {
  args: {
    value: 1,
  },
  render: (args) => {
    const [number, setNumber] = useState(args.value);

    return (
      <div className="w-48">
        <NumberInput
          value={number}
          step={1}
          onInput={(val) => {
            setNumber(val);
            args.onInput?.(val);
          }}
        />
      </div>
    );
  },
};
