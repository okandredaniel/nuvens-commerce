import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const PKGS = ['core', 'ui', 'brand-cosmos', 'brand-naturalex', 'brand-wooly', 'brand-zippex'];
const tsconfigOf = (rel) => path.resolve(__dirname, rel);
const pkgTsconfig = (pkg) => tsconfigOf(`packages/${pkg}/tsconfig.json`);
const existingPkgNames = PKGS.filter((p) => fs.existsSync(pkgTsconfig(p)));
const missingPkgNames = PKGS.filter((p) => !fs.existsSync(pkgTsconfig(p)));

const existingProjectTsconfigs = [
  tsconfigOf('tsconfig.base.json'),
  tsconfigOf('apps/storefront/tsconfig.json'),
  ...existingPkgNames.map(pkgTsconfig),
];

const typedTsGlobs = [
  'apps/storefront/**/*.{ts,tsx}',
  ...existingPkgNames.map((p) => `packages/${p}/**/*.{ts,tsx}`),
];

const untypedTsGlobs = [
  ...missingPkgNames.map((p) => `packages/${p}/**/*.{ts,tsx}`),
  'types/**/*.{ts,tsx,d.ts}',
];

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/build/',
      '**/dist/',
      '**/.react-router/',
      '**/.hydrogen/',
      '**/.oxygen/',
      '**/.mini-oxygen/',
      '**/.vite/',
      '**/coverage/',
      '**/*.graphql.d.ts',
      '**/*.graphql.ts',
      '**/*.generated.d.ts',
      '**/packages/hydrogen/dist/',
      'apps/storefront/.graphqlrc.ts',
      '**/.graphqlrc.ts',
    ],
  },

  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:eslint-comments/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ),

  {
    plugins: {
      'eslint-comments': fixupPluginRules(eslintComments),
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'eslint-comments/no-unused-disable': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-use-before-define': 'off',
      'no-warning-comments': 'off',
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
    },
  },

  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ).map((c) => ({ ...c, files: ['**/*.{js,jsx,ts,tsx}'] })),

  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ).map((c) => ({ ...c, files: ['**/*.{ts,tsx}'] })),

  {
    files: typedTsGlobs,
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(importPlugin),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: existingProjectTsconfigs,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/internal-regex': '^(@\\/|@nuvens\\/)',
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
        typescript: {
          alwaysTryTypes: true,
          project: existingProjectTsconfigs,
        },
      },
      'import/core-modules': ['virtual:react-router/server-build'],
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },

  {
    files: untypedTsGlobs,
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(importPlugin),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/internal-regex': '^(@\\/|@nuvens\\/)',
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
        typescript: {
          alwaysTryTypes: true,
          project: existingProjectTsconfigs,
        },
      },
      'import/core-modules': ['virtual:react-router/server-build'],
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },

  {
    files: ['**/.eslintrc.cjs'],
    languageOptions: { globals: { ...globals.node } },
  },

  ...compat.extends('plugin:jest/recommended').map((c) => ({ ...c, files: ['**/*.test.*'] })),
  {
    files: ['**/*.test.*'],
    plugins: { jest },
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },

  {
    files: ['**/*.server.*'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },

  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ),
  ).map((c) => ({ ...c, files: ['**/*.ts', '**/*.tsx'] })),

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
        },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'typeParameter', format: ['PascalCase'], leadingUnderscore: 'allow' },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/prop-types': 'off',
    },
  },

  {
    files: ['**/tokens.ts', 'apps/storefront/vite.config.ts'],
    rules: {
      '@typescript-eslint/naming-convention': ['error', { selector: 'property', format: null }],
    },
  },

  {
    files: ['apps/storefront/app/**/*.{ts,tsx}'],
    ignores: ['apps/storefront/app/server/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@server/*', '**/apps/storefront/app/server/**'],
              message: 'Server-only modules must not be imported in client code',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/storefront/app/server/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  prettierConfig,
];
