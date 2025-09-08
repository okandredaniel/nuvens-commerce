import { HelpCircle, Package, RefreshCw, Search, Shield, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SelfServiceGrid() {
  const { t: tSupport } = useTranslation('support');
  const items = [
    { key: 'faq', icon: HelpCircle, href: tSupport('links.faq.href') || '#faq' },
    { key: 'returns', icon: RefreshCw, href: tSupport('links.returns.href') || '#returns' },
    { key: 'warranty', icon: Shield, href: tSupport('links.warranty.href') || '#warranty' },
    { key: 'products', icon: Package, href: tSupport('links.products.href') || '#products' },
    { key: 'help', icon: Search, href: tSupport('links.help.href') || '#help' },
    { key: 'stores', icon: Store, href: tSupport('links.stores.href') || '#stores' },
  ];

  return (
    <section>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-on-surface)]">
          {tSupport('selfService.title')}
        </h2>
        <p className="text-xl text-[color:var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
          {tSupport('selfService.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, icon: Icon, href }) => (
          <div
            key={key}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl overflow-hidden"
          >
            <a href={href} className="block p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[color:var(--color-primary)]/10 group-hover:bg-[color:var(--color-primary)]/20 transition-colors flex-shrink-0">
                  <Icon className="w-7 h-7 text-[color:var(--color-primary)]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl text-[color:var(--color-on-surface)] group-hover:text-[color:var(--color-primary)] transition-colors">
                    {tSupport(`selfService.${key}.title`)}
                  </h3>
                  <p className="text-[color:var(--color-muted)] leading-relaxed">
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
