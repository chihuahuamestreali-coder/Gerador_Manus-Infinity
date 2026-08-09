import { Skull } from 'lucide-react';

interface DarkSpecialBannerProps {
  onClick?: () => void;
}

export default function DarkSpecialBanner({ onClick }: DarkSpecialBannerProps) {
  return (
    <div
      onClick={onClick}
      className="w-full mt-8 rounded-2xl border border-white/5 bg-black p-10 cursor-pointer transition-all duration-500 hover:bg-[#080808] hover:border-white/10 group flex items-center justify-center gap-6 shadow-2xl"
      style={{ minHeight: '160px' }}
    >
      <div className="flex items-center gap-6 group-hover:scale-105 transition-transform duration-500">
        <Skull className="w-12 h-12 text-white" />
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] uppercase">
          DARK
        </h2>
      </div>
    </div>
  );
}
