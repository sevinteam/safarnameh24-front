'use client';

import Image from 'next/image';
import { FaCheck } from 'react-icons/fa6';
import { useQueryState, parseAsArrayOf, parseAsInteger } from 'nuqs';

type Props = {
  id: number;
  title: string;
  type: 'hotel' | 'room';
  icon?: { link?: string | null } | null;
};

// ----------------------------

export default function FacilitiesItem(props: Props) {
  const { id, title, icon, type } = props;

  const [facilities, setFacilities] = useQueryState(
    `${type}-facilities`,
    parseAsArrayOf(parseAsInteger),
  );

  const checked = facilities?.includes(id) ?? false;

  const toggle = (value: boolean) => {
    if (value) {
      if (checked) return;
      setFacilities([...(facilities ?? []), id]);
    } else {
      const next = facilities?.filter((item) => item !== id) ?? [];
      setFacilities(next.length > 0 ? next : null);
    }
  };

  return (
    <div
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      onClick={() => toggle(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(!checked);
        }
      }}
      className="hover:bg-cs-blue/5 flex min-h-11 cursor-pointer items-center gap-3 px-5 py-2 select-none transition-colors outline-none"
    >
      <div
        className={`relative h-5 w-5 shrink-0 overflow-hidden rounded-[0.3rem] border transition-colors ${
          checked
            ? 'border-cs-blue bg-cs-blue'
            : 'border-zinc-300/80 bg-zinc-100'
        }`}
      >
        <div
          className={`flex-center bg-cs-blue absolute inset-0 transition-all duration-200 ease-in-out ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <FaCheck color="#fff" size={12} />
        </div>
      </div>

      <span className="flex flex-1 items-center text-[0.8rem] leading-5 font-bold text-zinc-700">
        {title}
      </span>

      {icon?.link && (
        <div className="flex-center h-5 w-5 shrink-0">
          <Image
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
            src={icon.link}
            alt={title || 'facilities-icon'}
          />
        </div>
      )}
    </div>
  );
}