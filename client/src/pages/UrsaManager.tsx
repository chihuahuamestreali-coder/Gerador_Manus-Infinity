import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cpu, Play, Loader2, Bot, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function UrsaManager() {
  const [, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [agentModel, setAgentModel] = useState('Ursa-v2-Omni (Multi-Modal Agent)');
  const [orchestrationMode, setOrchestrationMode] = useState('Parallel Swarm (Autonomous Pipeline)');
  const [profile, setProfile] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    setProfile({
      id: `ursa_agent_${Math.random().toString(36).substring(2, 10)}`,
      model: agentModel,
      mode: orchestrationMode,
      memoryPool: 'Redis Distributed Cluster (Active)',
      apiBridgeSecure: true,
      status: 'Ready for Deployment',
    });
    setIsGenerating(false);
    toast.success('Instância Ursa AI gerada com sucesso!');
  };

  const handleInjectAndOpen = async () => {
    if (!profile) {
      toast.error('Gere uma instância Ursa primeiro!');
      return;
    }
    setIsInjecting(true);
    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado!');
        setIsInjecting(false);
        return;
      }

      const fullScript = `
        (function() {
          try {
            window.__URSA_AGENT_ACTIVE__ = true;
            window.__URSA_AGENT_ID__ = "${profile.id}";
            window.__URSA_MODEL__ = "${profile.model}";
            
            console.log('%c🐻 Ursa AI Core Ativo - Autonomous Swarm Pipeline', 'color: #3b82f6; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #070c1f; font-family: monospace; color: #3b82f6; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🐻</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">URSA AI ORCHESTRATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">Agent ID: ${profile.id}<br/>Model: ${profile.model}</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://claude.ai';
            }, 1800);
          } catch(err) {
            console.error('Erro Ursa:', err);
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Ursa AI Orchestrator...</title></head>
        <body style="background:#070c1f;color:#3b82f6;display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;">
          <div>Iniciando Ursa Agent Swarm...</div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Ursa AI Pipeline disparado!');
    } catch(e) {
      toast.error('Erro ao abrir aba Ursa');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-blue-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bot className="w-4 h-4" />
              <span>Agent Automation Core</span>
            </div>
            <h1 className="text-3xl font-extrabold text-blue-400">URSA AI CORE</h1>
            <p className="text-sm text-muted-foreground">Orquestração de agentes autônomos de alta performance e automação inteligente</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['ursa']} accentClass="text-blue-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-blue-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              1. Configuração do Agente & Orquestração
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Modelo de Agente</label>
                <select value={agentModel} onChange={(e) => setAgentModel(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2.5 text-xs">
                  <option>Ursa-v2-Omni (Multi-Modal Agent)</option>
                  <option>Ursa-Autonomous-Pro (Task Execution)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Modo de Orquestração</label>
                <select value={orchestrationMode} onChange={(e) => setOrchestrationMode(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2.5 text-xs">
                  <option>Parallel Swarm (Autonomous Pipeline)</option>
                  <option>Sequential Chain (Step-by-Step)</option>
                </select>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Instância Ursa AI
            </Button>

            {profile && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-blue-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Agent ID:</span> <span className="font-bold text-blue-300">{profile.id}</span></div>
                <div><span className="text-muted-foreground">Model:</span> <span className="font-mono text-slate-200">{profile.model}</span></div>
                <div><span className="text-muted-foreground">Memory Pool:</span> <span className="font-mono text-slate-200">{profile.memoryPool}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="text-emerald-400 font-bold">{profile.status}</span></div>
              </div>
            )}
          </div>

          <div className="border border-blue-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-blue-300">Executar Pipeline de Agentes</h3>
              <p className="text-xs text-muted-foreground">Inicializa o enxame de automação e conecta à API bridge.</p>
            </div>
            <Button
              onClick={handleInjectAndOpen}
              disabled={!profile || isInjecting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              Executar Ursa AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
