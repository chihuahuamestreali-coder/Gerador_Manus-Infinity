import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Cpu, Lock } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DarkManager() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-emerald-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Ambiente Isolado / Privacy Lab</span>
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-400">DARK SECURITY SUITE</h1>
            <p className="text-sm text-muted-foreground">Ambiente reservado para futuras ferramentas de privacidade e blindagem avançada</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['dark']} accentClass="text-emerald-300" />

        <div className="mt-8 border border-emerald-500/30 rounded-2xl p-12 bg-card/40 backdrop-blur-sm text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-emerald-300 mb-2">Ambiente Preparado (Ainda Vazio)</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
            Este módulo está estruturado e pronto no ecossistema Device Master. Novos menus, túneis proxy e ferramentas de blindagem serão adicionados aqui em breve conforme as próximas especificações.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>STATUS: AGUARDANDO NOVOS SUB-MENUS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
