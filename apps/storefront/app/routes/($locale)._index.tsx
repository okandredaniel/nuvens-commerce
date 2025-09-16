import { HomePage } from '@nuvens/brand-ui';
import { Image } from '@shopify/hydrogen';

export const handle = { header: 'transparent' as const };

export default function Index() {
  return <HomePage slots={{ Image }} />;
}
