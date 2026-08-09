import { Palette } from 'lucide-react';

interface VanGoghBannerProps {
  onClick?: () => void;
}

export default function VanGoghBanner({ onClick }: VanGoghBannerProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onClick?.();
      }}
      className="group mt-5 flex min-h-[160px] w-full cursor-pointer items-center justify-center gap-6 rounded-2xl border border-fuchsia-300/15 bg-gradient-to-r from-[#0c0611] via-black to-[#070b14] p-10 shadow-2xl transition-all duration-500 hover:border-fuchsia-300/35 hover:bg-[#0b0710]"
    >
      <div className="flex items-center gap-6 transition-transform duration-500 group-hover:scale-105">
        <Palette className="h-12 w-12 text-fuchsia-200" />
        <div>
          <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-white md:text-5xl">VAN GOGH</h2>
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-fuchsia-200/70">Creative AI / 6 submenus independentes</p>
        </div>
      </div>
    </div>
  );
}
