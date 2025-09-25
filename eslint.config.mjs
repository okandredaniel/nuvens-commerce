import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
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

const PKGS = [
  'core',
  'ui',
  'shopify',
  'brand-cosmos',
  'brand-naturalex',
  'brand-wooly',
  'brand-zippex',
];

const tsconfigOf = (rel) => path.resolve(__dirname, rel);
const pkgTsconfig = (pkg) => tsconfigOf(`packages/${pkg}/tsconfig.json`);
const existingPkgNames = PKGS.filter((p) => fs.existsSync(pkgTsconfig(p)));
const missingPkgNames = PKGS.filter((p) => !fs.existsSync(pkgTsconfig(p)));

const uiTestTsconfig = tsconfigOf('packages/ui/tsconfig.test.json');
const hasUiTestTsconfig = fs.existsSync(uiTestTsconfig);

let existingProjectTsconfigs = [
  tsconfigOf('tsconfig.base.json'),
  tsconfigOf('apps/storefront/tsconfig.json'),
  ...existingPkgNames.map(pkgTsconfig),
];
if (hasUiTestTsconfig) existingProjectTsconfigs = [...existingProjectTsconfigs, uiTestTsconfig];

const typedTsGlobs = [
  'apps/storefront/**/*.{ts,tsx}',
  ...existingPkgNames.map((p) => `packages/${p}/**/*.{ts,tsx}`),
];

const untypedTsGlobs = [
  ...missingPkgNames.map((p) => `packages/${p}/**/*.{ts,tsx}`),
  'types/**/*.{ts,tsx,d.ts}',
];

const importResolver = {
  node: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] },
  typescript: { alwaysTryTypes: true, project: existingProjectTsconfigs },
};

const coreModules = [
  '@nuvens/brand-ui',
  '@nuvens/brand-ui/styles.css',
  '@nuvens/brand-ui/styles.css?url',
  '@nuvens/core',
  '@nuvens/shopify',
  '@nuvens/ui/styles.css',
  '@nuvens/ui/styles.css?url',
  '@testing-library/jest-dom/vitest',
  'virtual:react-router/server-build',
  'vitest/config',
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
      prettier: prettierPlugin,
      import: fixupPluginRules(importPlugin),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
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
      'object-shorthand': ['error', 'always'],
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
      'prettier/prettier': 'error',
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
      'import/resolver': importResolver,
      'import/core-modules': coreModules,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },

  {
    files: untypedTsGlobs,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/internal-regex': '^(@\\/|@nuvens\\/)',
      'import/resolver': importResolver,
      'import/core-modules': coreModules,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
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
        { selector: 'property', filter: { regex: '^\\d+$', match: true }, format: null },
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
      indent: 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'array-bracket-newline': 'off',
      'array-element-newline': 'off',
      'object-curly-newline': 'off',
      'object-property-newline': 'off',
      'newline-per-chained-call': 'off',
      'comma-dangle': 'off',
      quotes: 'off',
      semi: 'off',
      'key-spacing': 'off',
    },
  },

  {
    files: ['**/tokens.ts', 'apps/storefront/vite.config.ts'],
    rules: {
      '@typescript-eslint/naming-convention': ['error', { selector: 'property', format: null }],
    },
  },

  {
    files: ['apps/storefront/app/**/*.{ts,tsx,js,jsx}'],
    ignores: ['apps/storefront/app/server/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/server/*',
                '@/**/*.server',
                'apps/storefront/app/server/*',
                '**/apps/storefront/app/server/**',
              ],
              message: 'Server-only modules must not be imported in client code',
            },
            {
              group: ['@radix-ui/*', '@radix-ui/**'],
              message: 'Storefront must not import Radix directly; use @nuvens/ui.',
            },
            {
              group: ['**/tokens/**', '**/tokens.ts', '@nuvens/**/tokens', '@nuvens/**/tokens/*'],
              message: 'Do not use tokens; use the Tailwind theme in tailwind.config.*',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/storefront/app/**/*.test.*'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['apps/storefront/app/server/**/*.{ts,tsx,js,jsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['**/*.server.*'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-i18next',
              message: '@nuvens/ui must not depend on react-i18next; receive strings via props.',
            },
            {
              name: 'i18next',
              message: '@nuvens/ui must not depend on i18next; receive strings via props.',
            },
          ],
          patterns: [
            {
              group: ['**/tokens/**', '**/tokens.ts', '@nuvens/**/tokens', '@nuvens/**/tokens/*'],
              message: 'Do not use tokens; use the Tailwind theme in tailwind.config.*',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="useTranslation"]',
          message: '@nuvens/ui must not call useTranslation; pass i18n via props.',
        },
      ],
    },
  },

  {
    files: ['**/tailwind*.{js,ts}', '**/postcss.config.{js,ts}'],
    languageOptions: { parserOptions: { project: null } },
    rules: { '@typescript-eslint/naming-convention': 'off' },
  },

  {
    files: ['scripts/**/*.{js,mjs,ts}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'import/no-unresolved': ['error', { ignore: ['\\?url$', '\\.css$'] }],
    },
  },

  {
    files: [
      'packages/ui/vitest.setup.ts',
      'packages/ui/**/*.test.{ts,tsx}',
      'packages/ui/**/__tests__/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
        ...(hasUiTestTsconfig ? { project: [uiTestTsconfig] } : {}),
      },
      globals: { ...globals.vitest },
    },
    settings: {
      'import/internal-regex': '^(@\\/|@nuvens\\/)',
      'import/resolver': importResolver,
      'import/core-modules': coreModules,
    },
  },

  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
    ],
    languageOptions: { globals: { ...globals.vitest } },
  },

  {
    files: ['packages/ui/setup-tests.d.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: null,
        ecmaFeatures: { jsx: true },
      },
    },
  },

  {
    files: ['vitest.config.{ts,js,mjs,cjs}', '**/vitest.config.{ts,js,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: null },
      globals: { ...globals.node },
    },
    settings: {
      'import/resolver': importResolver,
      'import/core-modules': coreModules,
    },
  },

  {
    files: ['packages/shopify/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['@nuvens/brand-*'] }],
    },
    settings: {
      'import/resolver': {
        typescript: { project: 'packages/shopify/tsconfig.json' },
        node: {},
      },
      'import/core-modules': ['@shopify/hydrogen/storefront-api-types'],
    },
  },
];
