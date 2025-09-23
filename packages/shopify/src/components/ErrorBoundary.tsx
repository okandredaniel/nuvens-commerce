import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ErrorView } from './error/ErrorView';
import { NotFoundView } from './error/NotFound';

export function ErrorBoundary() {
  const error = useRouteError();
  const isResponse = isRouteErrorResponse(error);
  const status = isResponse ? (error as any).status : 500;

  if (status === 404) {
    return <NotFoundView />;
  }

  const message =
    (isResponse && ((error as any)?.data?.message ?? (error as any)?.data)) ||
    (error instanceof Error ? error.message : '');

  return <ErrorView status={status} message={message} />;
}
