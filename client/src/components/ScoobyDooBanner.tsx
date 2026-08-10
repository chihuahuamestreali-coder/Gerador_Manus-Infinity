import { MapPin, ArrowRight, Pizza, Beer } from 'lucide-react';

interface ScoobyDooBannerProps {
  onClick: () => void;
}

export default function ScoobyDooBanner({ onClick }: ScoobyDooBannerProps) {
  return (
    <div 
      onClick={onClick}
      className="mt-8 group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 p-8 cursor-pointer transition-all hover:border-primary/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <MapPin className="w-3.5 h-3.5 animate-bounce" />
            <span>Novo Menu Mestre / Delivery Hub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-3">
            SCOOBY-DOO <span className="text-primary">DELIVERY MASTER</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Hub especializado em bypass de geolocalização e anti-fraude para plataformas de delivery. 
            Injeção 16+ ferramentas, GPS Spoofing e simulação de App Nativo para iFood e Zé Delivery.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              <Pizza className="w-3.5 h-3.5" /> iFood Master
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[11px] font-bold">
              <Beer className="w-3.5 h-3.5" /> Zé Delivery Master
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full border-2 border-slate-950 bg-red-600 flex items-center justify-center shadow-lg"><Pizza className="w-6 h-6 text-white" /></div>
            <div className="w-12 h-12 rounded-full border-2 border-slate-950 bg-yellow-500 flex items-center justify-center shadow-lg"><Beer className="w-6 h-6 text-black" /></div>
          </div>
          <div className="mt-2 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
            ACESSAR HUB SCOOBY-DOO
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
