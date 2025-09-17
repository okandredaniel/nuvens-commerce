import type { RootLoader } from '@/root';
import { useRouteLoaderData } from 'react-router';
import type { RuntimeData } from './types';

export function useRuntime(): RuntimeData | undefined {
  return useRouteLoaderData<RootLoader>('root') as unknown as RuntimeData | undefined;
}
