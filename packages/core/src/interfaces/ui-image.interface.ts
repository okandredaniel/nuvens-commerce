import type { ComponentType, ImgHTMLAttributes } from 'react';

export type UIImgProps = Partial<
  Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt' | 'width' | 'height' | 'className' | 'sizes' | 'loading' | 'decoding' | 'srcSet'
  >
> &
  Record<string, unknown>;

export type UIImageComponent = ComponentType<UIImgProps>;
