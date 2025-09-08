import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router';
import { useLocalizedHref } from '~/hooks/useLocalizedHref';

type Props = Omit<RRLinkProps, 'prefetch'>;

export function LocalizedLink({ to, ...rest }: Props) {
  const localize = useLocalizedHref();
  return <RRLink to={localize(to)} {...rest} />;
}
