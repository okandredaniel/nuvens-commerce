import { useNavigate, type NavigateOptions, type To } from 'react-router';
import { useLocalizedHref } from './useLocalizedHref';

export function useLocaleNavigate() {
  const navigate = useNavigate();
  const localize = useLocalizedHref();
  return (to: To, opts?: NavigateOptions) => navigate(localize(to), opts);
}
