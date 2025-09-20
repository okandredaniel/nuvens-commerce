import { Language } from '../i18n/i18n.interface';
import {
  accordionItemsEn,
  accordionItemsEs,
  accordionItems as accordionItemsFr,
  faqItemsEn,
  faqItemsEs,
  faqItems as faqItemsFr,
} from './questions';

export type PdpMeta = {
  uspBullets?: string[];
  videoYoutubeId?: string;
  videoPreview?: string;
  trustedYoutubeIds?: string[];
  ratingValue?: number;
  ratingCount?: number;
  comfortImage?: string;
  maxQty?: number;
  faqRef?: { id: string } | null;
  infoItems?: typeof accordionItemsFr;
  faqItems?: typeof faqItemsFr;
};

type Key = string;

const data: Record<Key, Omit<PdpMeta, 'uspBullets' | 'infoItems' | 'faqItems'>> = {
  default: {
    videoYoutubeId: 'mLfbLhKIMI',
    videoPreview: '/zippex-cambio-de-nucleos.mov',
    trustedYoutubeIds: [
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
      'DJy5ylsibX8',
    ],
    ratingValue: 4.5,
    ratingCount: 73,
    comfortImage: 'https://cdn.shopify.com/s/files/1/0909/7173/4352/files/dormiendo.jpg',
    maxQty: 10,
    faqRef: null,
  },
};

const i18nBullets: Record<Key, Record<Language, string[]>> = {
  default: {
    en: [],
    es: [],
    fr: [],
    it: [],
    pt: [],
  },
};

export function getPdpMetaMock(locale: Language, productId?: string, handle?: string): PdpMeta {
  const key =
    (productId && data[productId] && productId) || (handle && data[handle] && handle) || 'default';
  const meta = data[key];
  const bullets = i18nBullets[key]?.[locale] ?? i18nBullets.default[locale] ?? [];

  const infoItems = {
    fr: accordionItemsFr,
    en: accordionItemsEn,
    es: accordionItemsEs,
    pt: [],
    it: [],
  };

  const faqItems = {
    fr: faqItemsFr,
    en: faqItemsEn,
    es: faqItemsEs,
    pt: [],
    it: [],
  };

  return {
    ...meta,
    uspBullets: bullets,
    infoItems: infoItems[locale],
    faqItems: faqItems[locale],
  };
}
