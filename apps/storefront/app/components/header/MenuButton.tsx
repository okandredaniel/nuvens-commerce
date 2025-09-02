import { useAside } from '~/components/Aside';
import { FiMenu } from 'react-icons/fi';

export function MenuButton({ ring }: { ring: string }) {
  const { open } = useAside();

  return (
    <button
      aria-label="Open menu"
      onClick={() => open('mobile')}
      className="inline-grid place-items-center size-10 rounded-full"
      style={{ border: `2px solid ${ring}` }}
    >
      <FiMenu className="text-black size-5" />
    </button>
  );
}
