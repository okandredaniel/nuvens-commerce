import { useLocalizedHref } from '@/hooks/useLocalizedHref';
import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router';

export function LocalizedLink({ to, ...rest }: RRLinkProps) {
  const localize = useLocalizedHref();
  return <RRLink to={localize(to)} {...rest} />;
}
