import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  ...compat.extends('next/core-web-vitals'),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    ignores: ['**/node_modules/**', '!src/**', '!public/**', '*'],
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx}'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          basePath: '.',
          zones: [
            {
              target: './src/pages',
              from: './src/app',
              message: 'pages cannot import from app',
            },
            {
              target: './src/widgets',
              from: ['./src/app', './src/pages'],
            },
            {
              target: './src/features',
              from: ['./src/app', './src/pages', './src/widgets'],
            },
            {
              target: './src/entities',
              from: ['./src/app', './src/pages', './src/widgets', './src/features'],
            },
            {
              target: './src/shared',
              from: [
                './src/app',
                './src/pages',
                './src/widgets',
                './src/features',
                './src/entities',
              ],
            },
          ],
        },
      ],

      // 상대 경로 제한
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: '상대 경로 대신 절대 경로를 사용하세요.',
            },
          ],
        },
      ],

      // 순환 참조 방지
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
);
