module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['xo-space/esnext', 'xo-typescript', 'prettier/@typescript-eslint'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/explicit-function-return-type': 0,
    'capitalized-comments': 0,
    'no-await-in-loop': 0,
    '@typescript-eslint/camelcase': 0,
    'comma-dangle': ['error', 'always-multiline'],
  },
};
