import { type PdpMeta } from '../mocks/pdp';

export type ImageProps = React.ComponentType<
  Partial<
    Pick<
      React.ImgHTMLAttributes<HTMLImageElement>,
      'src' | 'alt' | 'width' | 'height' | 'className' | 'sizes' | 'loading' | 'decoding' | 'srcSet'
    >
  > &
    Record<string, unknown>
>;

export type ProductTemplateSlots = {
  ProductGallery: React.ComponentType<{ product: any; variantImage?: any }>;
  ProductPrice: React.ComponentType<{ price: any; compareAtPrice?: any }>;
  ProductForm: React.ComponentType<{ productOptions: any[]; selectedVariant: any; maxQty: number }>;
  ProductRating?: React.ComponentType<{ rating: number; count: number }>;
  RichText: React.ComponentType<{ html: string; className?: string }>;
  Image: ImageProps;
};

export type ProductTemplateProps = {
  product: any;
  selectedVariant: any;
  productOptions: any[];
  maxQty: number;
  slots: ProductTemplateSlots;
  meta: PdpMeta;
};
