import { useAside } from '~/components/Aside';
import { FiMenu } from 'react-icons/fi';

export function MenuButton() {
  const { open } = useAside();

  return (
    <button
      aria-label="Open menu"
      onClick={() => open('mobile')}
      className="inline-grid place-items-center size-10 rounded-full border-1 border-zinc-300"
    >
      <FiMenu className="text-black size-5" />
    </button>
  );
}
