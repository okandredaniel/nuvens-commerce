import type { CodegenConfig } from '@graphql-codegen/cli';
import { getSchema, pluckConfig, preset } from '@shopify/hydrogen-codegen';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(here, '../../apps/storefront');
const filename = path.resolve(here, 'src/types/storefrontapi.generated.d.ts');

export default {
  overwrite: true,
  pluckConfig,
  generates: {
    [filename]: {
      preset,
      schema: getSchema('storefront'),
      documents: [
        path.resolve(appDir, 'app/**/*.{ts,tsx,gql,graphql}'),
        path.resolve(here, 'src/**/*.{ts,tsx,gql,graphql}'),
        '!' + path.resolve(appDir, 'app/graphql/customer-account/**/*'),
        '!' + path.resolve(appDir, 'app/routes/($lang).account*/**/*'),
        '!' + path.resolve(appDir, 'app/routes/($lang).orders*/**/*'),
      ],
    },
  },
} as CodegenConfig;
