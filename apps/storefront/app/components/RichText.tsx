import { cn } from '@nuvens/ui-core';

export function RichText({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  return <article className={cn('rte', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
