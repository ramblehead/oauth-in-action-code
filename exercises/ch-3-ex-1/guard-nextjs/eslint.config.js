// Hey Emacs, this is -*- coding: utf-8 -*-

/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('./.meta/rh-ts-library/eslint.config.js');

module.exports = {
  ...config,
  extends: [
    ...config.extends,
    // 'plugin:react/recommended',
  ],
  plugins: [
    ...config.plugins,
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  parserOptions: {
    ...config.parserOptions,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    ...config.rules,
    'react/jsx-filename-extension': ['error', {
      extensions: ['.tsx', '.jsx'],
    }],
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'max-classes-per-file': 'off',
    'no-console': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/destructuring-assignment': 'off',
    'react/forbid-component-props': ['warn', { forbid: ['style'] }],
    'react/forbid-dom-props': ['warn', { forbid: ['style'] }],
    'react/jsx-one-expression-per-line': 'off',
    // 'react/jsx-one-expression-per-line': ['error', {
    //   allow: 'single-child'
    // }],
  },
  settings: {
    ...config.settings,
    react: {
      version: 'detect',
    },
  },
};
