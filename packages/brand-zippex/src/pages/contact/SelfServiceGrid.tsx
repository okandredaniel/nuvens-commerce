import { HelpCircle, Package, RefreshCw, Search, Shield, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SelfServiceGrid() {
  const { t: tSupport } = useTranslation('support');
  const items = [
    {
      key: 'faq',
      icon: HelpCircle,
      href: tSupport('links.faq.href') || '#faq',
    },
    {
      key: 'returns',
      icon: RefreshCw,
      href: tSupport('links.returns.href') || '#returns',
    },
    {
      key: 'warranty',
      icon: Shield,
      href: tSupport('links.warranty.href') || '#warranty',
    },
    {
      key: 'products',
      icon: Package,
      href: tSupport('links.products.href') || '#products',
    },
    {
      key: 'help',
      icon: Search,
      href: tSupport('links.help.href') || '#help',
    },
    {
      key: 'stores',
      icon: Store,
      href: tSupport('links.stores.href') || '#stores',
    },
  ];

  return (
    <section>
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-4xl font-bold text-neutral-950 md:text-5xl">
          {tSupport('selfService.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-600">
          {tSupport('selfService.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, icon: Icon, href }) => (
          <div
            key={key}
            className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <a href={href} className="block space-y-4 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-xl bg-primary-600/10 p-3 transition-colors group-hover:bg-primary-600/20">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-neutral-950 transition-colors group-hover:text-primary-600">
                    {tSupport(`selfService.${key}.title`)}
                  </h3>
                  <p className="leading-relaxed text-neutral-600">
                    {tSupport(`selfService.${key}.desc`)}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
