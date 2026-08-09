import { Skull, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DarkSpecial() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Botão Voltar no topo esquerdo */}
      <div className="absolute top-8 left-8">
        <button
          onClick={() => setLocation('/')}
          className="text-[#555] hover:text-white text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 transition-colors uppercase"
        >
          <ArrowLeft className="w-3 h-3" />
          VOLTAR AO PAINEL
        </button>
      </div>

      {/* Conteúdo Centralizado */}
      <div className="flex flex-col items-center text-center max-w-2xl">
        {/* Skull Icon in Box */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] border border-[#222] flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <Skull className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Small Label */}
        <div className="mb-2">
          <p className="text-[9px] text-[#444] font-bold tracking-[0.4em] uppercase">
            DEVICE MASTER / RESERVED AREA
          </p>
        </div>

        {/* Título DARK */}
        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-[0.1em]">
          DARK
        </h1>

        {/* Descrição */}
        <p className="text-xs md:text-sm text-[#666] font-medium leading-relaxed max-w-md">
          Ambiente reservado para futuras expansões. Nenhum menu foi<br />
          adicionado aqui por enquanto.
        </p>
      </div>
    </div>
  );
}
