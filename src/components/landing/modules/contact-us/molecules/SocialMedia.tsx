import Link from 'next/link';
import Image from 'next/image';

type Props = {
  link: string;
  type: string;
  type_fa: string;
  icon: { url: string };
};

// ----------------------------------------

export default function SocialMedia(props: Props) {
  const { link, type, type_fa, icon } = props;

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl bg-white p-6 shadow-[0_1rem_1rem_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out xl:bg-[#F8F8F8] xl:shadow-none xl:hover:bg-white xl:hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.08)]">
      {/* Animated Red Stroke Border on Hover */}
      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible rounded-xl">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          fill="none"
          stroke="#F30F26"
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="25 75"
          className="animate-stroke-draw opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>

      <div className="flex-center h-12 w-12 rounded-lg bg-cs-red/10 p-2.5">
        {icon.url && <Image alt="icon" width={25} height={25} src={icon.url} />}
      </div>

      <div className="flex items-center gap-2">
        <span className="mt-3 text-cs85 font-extrabold capitalize text-zinc-800">
          {type_fa}
        </span>

        <div className="mt-2 h-4 w-0.5 rounded bg-zinc-400" />

        <span className="mt-3 text-cs85 font-extrabold capitalize text-zinc-800">
          {type}
        </span>
      </div>

      {link && (
        <Link
          href={link}
          target="_blank"
          className="font-inter text-cs75 font-semibold text-zinc-500"
        >
          <span className="underline">{link}</span>
        </Link>
      )}
    </div>
  );
}
