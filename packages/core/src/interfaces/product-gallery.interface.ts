import type { ImageProps } from '../types/product.types';
import type { GalleryImage } from './gallery.interface';

export type ProductGalleryProps = {
  Image: ImageProps;
  images: GalleryImage[];
  variantImage?: GalleryImage | null;
  className?: string;
  sizesMain?: string;
  sizesThumb?: string;
  aspectRatioMain?: string;
  aspectRatioThumb?: string;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};
