import { PolicyCard } from './PolicyCard';

export type PolicyItem = { id: string; title: string; handle: string };

export function PoliciesGrid({ policies }: { policies: PolicyItem[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {policies.map((p) => (
        <li key={p.id}>
          <PolicyCard policy={p} />
        </li>
      ))}
    </ul>
  );
}
