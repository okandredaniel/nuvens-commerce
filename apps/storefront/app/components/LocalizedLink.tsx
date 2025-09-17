import { useLocalizedHref } from '@/hooks/useLocalizedHref';
import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router';

type Props = Omit<RRLinkProps, 'prefetch'>;

export function LocalizedLink({ to, ...rest }: Props) {
  const localize = useLocalizedHref();
  return <RRLink to={localize(to)} {...rest} />;
}
