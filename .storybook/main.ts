import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  stories: ['../src/**/*.stories.tsx', '../src/**/*.stories.ts'],
  // 👈 Add this
  framework: '@storybook/nextjs',

  docs: {
    autodocs: true,
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  staticDirs: ['../public'],

  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-styling',
      options: {
        postcss: true,
      },
    },
  ],
};

export default config;
