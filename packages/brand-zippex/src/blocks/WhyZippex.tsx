import type { ProductTemplateProps } from '@nuvens/core';
import { Container, Heading } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import zippexMattressHeartIcon from '../assets/zippex-heart.svg';
import zippexMattressSplitIcon from '../assets/zippex-mattress-split.svg';
import zippexMattressIcon from '../assets/zippex-mattress.svg';
import zippexMattressShieldIcon from '../assets/zippex-shield.svg';
import zippexMattressTruckIcon from '../assets/zippex-truck.svg';
import zippexMattressWalletIcon from '../assets/zippex-wallet.svg';

type Props = {
  image: ProductTemplateProps['slots']['Image'];
};

export function WhyZippex({ image: Image }: Props) {
  const { t } = useTranslation('product');

  return (
    <Container className="py-16 text-center">
      <Heading id="why-zippex-heading" className="mb-4" align="center">
        {t('why.heading')}
      </Heading>

      <ul
        aria-labelledby="why-zippex-heading"
        className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16 sm:items-end"
      >
        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.sixFirmness')}</p>
        </li>

        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressSplitIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.customers')}</p>
        </li>

        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressHeartIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.dualAdjust')}</p>
        </li>

        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressShieldIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.tryFree')}</p>
        </li>

        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressTruckIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.deliveryReturns')}</p>
        </li>

        <li>
          <Image
            className="mx-auto h-12 sm:h-[70px] w-auto max-w-[175px] object-contain"
            src={zippexMattressWalletIcon}
            alt=""
            aria-hidden
          />
          <p className="pt-3 sm:pt-4 text-neutral-900">{t('why.items.splitPayment')}</p>
        </li>
      </ul>
    </Container>
  );
}
