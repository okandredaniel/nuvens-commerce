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

const base = 'block tracking-tight antialiased font-bold';
const tones: Record<Tone, string> = {
  default: 'text-[color:var(--heading-color,var(--color-on-surface))]',
  muted: 'text-[color:var(--color-muted)]',
  onPrimary: 'text-[color:var(--color-on-primary)]',
};
const alignments: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
const sizes: Record<Size, string> = {
  display:
    'text-[length:var(--heading-display-size,3.5rem)] leading-[var(--heading-display-leading,1.1)]',
  h1: 'text-[length:var(--heading-h1-size,2.25rem)] leading-[var(--heading-h1-leading,1.15)]',
  h2: 'text-[length:var(--heading-h2-size,1.875rem)] leading-[var(--heading-h2-leading,1.2)]',
  h3: 'text-[length:var(--heading-h3-size,1.5rem)] leading-[var(--heading-h3-leading,1.25)]',
  h4: 'text-[length:var(--heading-h4-size,1.25rem)] leading-[var(--heading-h4-leading,1.3)]',
  h5: 'text-[length:var(--heading-h5-size,1.125rem)] leading-[var(--heading-h5-leading,1.35)]',
  h6: 'text-[length:var(--heading-h6-size,1rem)] leading-[var(--heading-h6-leading,1.4)]',
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
  { as, size, align = 'left', tone = 'default', className, style, children, ...rest }: Props<T>,
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
