import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type HeadingTag = (typeof tags)[number];
type Size = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type Align = 'left' | 'center' | 'right';
type Tone = 'default' | 'muted' | 'onPrimary';

type Props<T extends HeadingTag = 'h2'> = {
  as?: T;
  size?: Size;
  align?: Align;
  tone?: Tone;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, 'className'>;

const base = 'block font-bold tracking-tight antialiased';
const tones: Record<Tone, string> = {
  default: 'text-neutral-950',
  muted: 'text-neutral-600',
  onPrimary: 'text-neutral-0',
};
const alignments: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
const sizes: Record<Size, string> = {
  display: 'text-5xl md:text-6xl leading-tight',
  h1: 'text-4xl leading-tight',
  h2: 'text-3xl leading-snug',
  h3: 'text-2xl leading-snug',
  h4: 'text-xl leading-snug',
  h5: 'text-lg leading-snug',
  h6: 'text-base leading-snug',
};
const defaultSizeByTag: Record<HeadingTag, Size> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

function HeadingInner<T extends HeadingTag = 'h2'>(
  { as, size, align = 'left', tone = 'default', className, children, ...rest }: Props<T>,
  ref: React.Ref<HTMLHeadingElement>,
) {
  const Tag = (as || 'h2') as HeadingTag;
  const visual = size || defaultSizeByTag[Tag];
  const cls = cn(base, sizes[visual], alignments[align], tones[tone], className);

  return (
    <Tag ref={ref as any} className={cls} {...(rest as any)}>
      {children}
    </Tag>
  );
}

type HeadingComponent = <T extends HeadingTag = 'h2'>(
  props: Props<T> & { ref?: React.Ref<HTMLHeadingElement> },
) => React.ReactElement | null;

export const Heading = forwardRef(HeadingInner) as HeadingComponent;
