import { Sheet } from '@nuvens/ui-core';
import { createContext, useContext, useState } from 'react';

type Kind = 'cart' | 'mobile' | null;
type Ctx = { kind: Kind; open: (k: Exclude<Kind, null>) => void; close: () => void };

const AsideCtx = createContext<Ctx | null>(null);

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
  const width =
    type === 'mobile'
      ? widthClass || 'w-[90vw] max-w-sm'
      : type === 'cart'
        ? widthClass || 'w-[92vw] sm:w-[420px]'
        : widthClass || 'w-[92vw] sm:w-[560px]';

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
