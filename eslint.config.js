import fiskerEslintConfig from '@fisker/eslint-config';

export default [
  ...fiskerEslintConfig,
  {
    ignores: ['index.js'],
  },
  {
    rules: {
      'unicorn/consistent-class-member-order': 'off',
    },
  },
];
