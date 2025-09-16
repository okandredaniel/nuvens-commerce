import {
  accordionItemsEn,
  accordionItemsEs,
  accordionItems as accordionItemsFr,
  faqItemsEn,
  faqItemsEs,
  faqItems as faqItemsFr,
} from './questions';

export type PdpMeta = {
  usp_bullets?: string[];
  video_youtube_id?: string;
  video_preview?: string;
  trusted_youtube_ids?: string[];
  rating_value?: number;
  rating_count?: number;
  comfort_image?: string;
  max_qty?: number;
  faq_ref?: { id: string } | null;
  info_items?: typeof accordionItemsFr;
  faq_items?: typeof faqItemsFr;
};

type Key = string;
type Locale = 'en' | 'es' | 'fr';

const data: Record<Key, Omit<PdpMeta, 'usp_bullets' | 'info_items' | 'faq_items'>> = {
  default: {
    video_youtube_id: 'm_lfbLhKIMI',
    video_preview: '/zippex-cambio-de-nucleos.mov',
    trusted_youtube_ids: [
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
    ],
    rating_value: 4.5,
    rating_count: 73,
    comfort_image: 'https://cdn.shopify.com/s/files/1/0909/7173/4352/files/dormiendo.jpg',
    max_qty: 10,
    faq_ref: null,
  },
};

const i18nBullets: Record<Key, Record<Locale, string[]>> = {
  default: {
    en: [],
    es: [],
    fr: [],
  },
};

export function getPdpMetaMock(locale: Locale, productId?: string, handle?: string): PdpMeta {
  const key =
    (productId && data[productId] && productId) || (handle && data[handle] && handle) || 'default';
  const meta = data[key];
  const bullets = i18nBullets[key]?.[locale] ?? i18nBullets.default[locale] ?? [];

  const infoItems = {
    fr: accordionItemsFr,
    en: accordionItemsEn,
    es: accordionItemsEs,
  };

  const faqItems = {
    fr: faqItemsFr,
    en: faqItemsEn,
    es: faqItemsEs,
  };

  return {
    ...meta,
    usp_bullets: bullets,
    info_items: infoItems[locale],
    faq_items: faqItems[locale],
  };
}
