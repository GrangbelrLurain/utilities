import '@/styles/globals.css';

import { Meta, StoryObj } from '@storybook/react';

import SomePresentational from '@/components/presentationals/somePresentational';
import { createMockUser } from '@/schemas/user';

const meta: Meta<typeof SomePresentational> = {
  component: SomePresentational,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['dashboard', 'analytics'],
      },
    },
  },
  args: {
    user: createMockUser(1),
  },
};

type Story = StoryObj<typeof SomePresentational>;

export const Example: Story = {
  parameters: {
    nextjs: {
      pathname: '/',
    },
  },
};

export default meta;
