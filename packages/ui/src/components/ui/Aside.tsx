import { createContext, useContext, useMemo, useState } from 'react';
import { Sheet } from './Sheet';

export type Kind = 'cart' | 'mobile' | null;
type Ctx = { kind: Kind; open: (k: Exclude<Kind, null>) => void; close: () => void };

const ASIDE_CTX_KEY = Symbol.for('@nuvens/ui/AsideCtx');
const g = globalThis as unknown as Record<string | symbol, any>;
const AsideCtx: React.Context<Ctx | null> =
  g[ASIDE_CTX_KEY] ?? (g[ASIDE_CTX_KEY] = createContext<Ctx | null>(null));
AsideCtx.displayName = 'AsideCtx';

export function useAside() {
  const ctx = useContext(AsideCtx);
  if (!ctx) throw new Error('useAside must be used within an Aside.Provider');
  return ctx;
}

type AsideProps = {
  children?: React.ReactNode;
  heading?: React.ReactNode;
  type: Exclude<Kind, null>;
  side?: 'right' | 'left';
  widthClass?: string;
};

type AsideComponent = React.FC<AsideProps> & {
  Provider: React.FC<{ children: React.ReactNode }>;
};

export const Aside: AsideComponent = ({ children, heading, type, side = 'right', widthClass }) => {
  const { kind, close } = useAside();
  const open = kind === type;

  const width = useMemo(() => {
    if (widthClass) return widthClass;
    if (type === 'mobile') return 'w-[90vw] max-w-sm';
    if (type === 'cart') return 'w-[92vw] sm:w-[420px]';
    return 'w-[92vw] sm:w-[560px]';
  }, [type, widthClass]);

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => (o ? null : close())}
      side={side}
      widthClass={width}
      title={heading}
    >
      {children}
    </Sheet>
  );
};

Aside.Provider = function AsideProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<Kind>(null);
  return (
    <AsideCtx.Provider
      value={{
        kind,
        open: (k) => setKind(k),
        close: () => setKind(null),
      }}
    >
      {children}
    </AsideCtx.Provider>
  );
};
