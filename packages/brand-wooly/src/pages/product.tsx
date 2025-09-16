import type { ProductTemplateProps } from '@nuvens/core';
import { Container } from '@nuvens/ui';

export function ProductPage({
  product,
  selectedVariant,
  productOptions,
  maxQty,
  slots,
  meta,
}: ProductTemplateProps) {
  return (
    <section className="py-20 bg-cyan-500">
      <Container>Página de produtos</Container>
    </section>
  );
}
