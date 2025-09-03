import { Link as RRLink, type LinkProps as RRLinkProps } from 'react-router';
import { useLocalizedHref } from '~/hooks/useLocalizedHref';

export function LocalizedLink(props: RRLinkProps) {
  const localize = useLocalizedHref();
  const { to, ...rest } = props;
  return <RRLink to={localize(to)} {...rest} />;
}
