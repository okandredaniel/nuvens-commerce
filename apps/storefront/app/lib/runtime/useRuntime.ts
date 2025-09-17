import type { RootLoader } from '@/root';
import { useRouteLoaderData } from 'react-router';
import type { RuntimeData } from '../../interfaces/runtime.interface';

export function useRuntime(): RuntimeData | undefined {
  return useRouteLoaderData<RootLoader>('root') as unknown as RuntimeData | undefined;
}
