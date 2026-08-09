import { useState } from 'react';
import { ArrowLeft, ExternalLink, Palette, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ModuleGuide from '@/components/ModuleGuide';
import ExternalServiceWorkspace from '@/components/ExternalServiceWorkspace';
import { EXTERNAL_SERVICES, VAN_GOGH_SERVICE_KEYS, type VanGoghServiceKey } from '@/lib/externalServiceCatalog';
import { MODULE_GUIDES } from '@/lib/moduleGuides';

export default function VanGoghHub() {
  const [, setLocation] = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState<VanGoghServiceKey | null>(null);

  const activeService = activeSubmenu ? EXTERNAL_SERVICES[activeSubmenu] : null;

  return (
    <div className="min-h-screen bg-[#07050b] p-6 font-mono text-white md:p-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-fuchsia-300/20 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200">
              <Palette className="h-4 w-4" />
              <span>Creative Master Hub / 6 submenus</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-[0.18em] text-white md:text-4xl">VAN GOGH</h1>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">Seis entradas independentes para ferramentas de criação com IA. Cada submenu mantém sua própria preparação local e abre somente o destino oficial informado.</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-fuchsia-300/30 bg-black/30 text-fuchsia-100 hover:bg-fuchsia-300/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Menu Principal
          </Button>
        </header>

        {!activeService ? (
          <>
            <ModuleGuide guide={MODULE_GUIDES['hackaigc']} accentClass="text-fuchsia-200" />

            <section className="rounded-2xl border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-950/30 via-black/70 to-indigo-950/20 p-6 shadow-2xl md:p-8">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-fuchsia-100"><Sparkles className="h-5 w-5 text-fuchsia-200" /> Escolha um submenu independente</h2>
                  <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">A lista preserva as seis entradas solicitadas, incluindo a segunda entrada HackAIGC como um laboratório separado. O perfil local é opcional e não envia dados aos destinos.</p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100">local diagnostics only</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VAN_GOGH_SERVICE_KEYS.map((key) => {
                  const service = EXTERNAL_SERVICES[key];
                  const Icon = service.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveSubmenu(key)}
                      className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-white/10 bg-black/35 p-5 text-left transition-all hover:-translate-y-1 hover:border-fuchsia-300/50 hover:bg-fuchsia-950/20"
                    >
                      <div>
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/50"><Icon className={`h-5 w-5 ${service.color}`} /></div>
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">submenu</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-100">{service.name}</h3>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{service.description}</p>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-fuchsia-200">
                        <span>Abrir workspace</span>
                        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <ExternalServiceWorkspace
            service={activeService}
            guide={MODULE_GUIDES[activeService.key]}
            modeLabel="Van Gogh / submenu independente"
            onBack={() => setActiveSubmenu(null)}
          />
        )}
      </div>
    </div>
  );
}
