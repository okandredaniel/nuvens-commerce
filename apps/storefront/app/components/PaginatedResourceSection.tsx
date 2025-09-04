import { Button } from '@nuvens/ui-core';
import { Pagination } from '@shopify/hydrogen';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type PaginationProps<NodesType> = {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{ node: NodesType; index: number }>;
  resourcesClassName?: string;
};

export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: PaginationProps<NodesType>) {
  const { t } = useTranslation('catalog');

  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const items = nodes.map((node, index) => children({ node, index }));

        return (
          <section aria-busy={isLoading} className="space-y-4">
            <div className="flex justify-center">
              <Button asChild variant="outline" size="sm">
                <PreviousLink>{isLoading ? t('loading') : t('loadPrevious')}</PreviousLink>
              </Button>
            </div>

            {resourcesClassName ? (
              <div className={resourcesClassName}>{items}</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {items}
              </div>
            )}

            <div className="flex justify-center">
              <Button asChild variant="outline" size="sm">
                <NextLink>{isLoading ? t('loading') : t('loadMore')}</NextLink>
              </Button>
            </div>

            <span className="sr-only" role="status">
              {isLoading ? t('loading') : t('idle')}
            </span>
          </section>
        );
      }}
    </Pagination>
  );
}
