// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser'; // ← ВАЖНО: импортируем модуль

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended, // пресеты для TS
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser, // ← сюда передаём сам модуль, а не строку
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
