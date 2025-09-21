import type { PredictiveSearchQuery, RegularSearchQuery } from 'storefrontapi.generated';

type ResultWithItems<Type extends 'predictive' | 'regular', Items> = {
  type: Type;
  term: string;
  error?: string;
  result: { total: number; items: Items };
};

export type RegularSearchReturn = ResultWithItems<'regular', RegularSearchQuery>;
export type PredictiveSearchReturn = ResultWithItems<
  'predictive',
  NonNullable<PredictiveSearchQuery['predictiveSearch']>
>;

export function getEmptyPredictiveSearchResult(): PredictiveSearchReturn['result'] {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}

interface UrlWithTrackingParams {
  baseUrl: string;
  trackingParams?: string | null;
  params?: Record<string, string>;
  term: string;
}

export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}: UrlWithTrackingParams) {
  const usp = new URLSearchParams();
  if (extraParams) {
    for (const [k, v] of Object.entries(extraParams)) {
      if (k === 'q') continue;
      usp.append(k, v);
    }
  }
  usp.append('q', encodeURIComponent(term));
  let search = usp.toString();
  if (trackingParams) {
    search = `${search}&${trackingParams}`;
  }
  return `${baseUrl}?${search}`;
}
