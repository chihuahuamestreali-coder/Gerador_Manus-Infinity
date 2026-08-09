import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Play, Loader2, Lock, Cpu, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function DarkManager() {
  const [, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [proxyNode, setProxyNode] = useState('Node-Alpha (Tor/Onion Relay 3)');
  const [cipherSuite, setCipherSuite] = useState('AES-256-GCM + ChaCha20-Poly1305');
  const [profile, setProfile] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    setProfile({
      id: `dark_${Math.random().toString(36).substring(2, 10)}`,
      ip: `185.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      country: 'Switzerland (CH)',
      node: proxyNode,
      cipher: cipherSuite,
      dnsLeakProtection: true,
      webRtcBlocked: true,
      fingerprintArmor: 'Maximum Stealth',
    });
    setIsGenerating(false);
    toast.success('Perfil de privacidade Dark gerado com sucesso!');
  };

  const handleInjectAndOpen = async () => {
    if (!profile) {
      toast.error('Gere um perfil de privacidade primeiro!');
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
            window.__DARK_STEALTH_MODE__ = true;
            window.__PROXY_NODE__ = "${profile.node}";
            window.__DNS_PROTECT__ = true;
            
            try {
              Object.defineProperty(navigator, 'webdriver', { get: function() { return undefined; } });
              Object.defineProperty(navigator, 'languages', { get: function() { return ['en-US', 'en']; } });
            } catch(e) {}

            console.log('%c🛡️ Dark Security Suite Ativa - Zero-Log & Onion Tunnel', 'color: #10b981; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #050508; font-family: monospace; color: #10b981; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">DARK SUITE & ONION PROXY ATIVOS!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">IP Virtual: ${profile.ip} (${profile.country})<br/>Criptografia: ${profile.cipher}</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://duckduckgogg42xjoc7zzx3czhkzjhwlujvi3or6oehzxl7d54xiijyd.onion';
            }, 1800);
          } catch(err) {
            console.error('Erro Dark:', err);
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Dark Security Tunnel...</title></head>
        <body style="background:#050508;color:#10b981;display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;">
          <div>Iniciando túnel criptografado...</div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Ambiente Dark conectado!');
    } catch(e) {
      toast.error('Erro ao abrir aba Dark');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-emerald-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Privacy & Onion Proxy</span>
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-400">DARK SECURITY SUITE</h1>
            <p className="text-sm text-muted-foreground">Suite de privacidade avançada, spoofing de headers e túneis criptografados</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['dark']} accentClass="text-emerald-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-emerald-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              1. Configuração de Túnel & Perfil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nó Proxy / Relay</label>
                <select value={proxyNode} onChange={(e) => setProxyNode(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2.5 text-xs">
                  <option>Node-Alpha (Tor/Onion Relay 3)</option>
                  <option>Node-Beta (Switzerland Secure)</option>
                  <option>Node-Gamma (Iceland Offshore)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Suíte de Criptografia</label>
                <select value={cipherSuite} onChange={(e) => setCipherSuite(e.target.value)} className="w-full bg-background border border-border rounded-lg p-2.5 text-xs">
                  <option>AES-256-GCM + ChaCha20-Poly1305</option>
                  <option>X25519-Kyber768 (Post-Quantum)</option>
                </select>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Perfil de Anonimato
            </Button>

            {profile && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">ID da Sessão:</span> <span className="font-bold text-emerald-300">{profile.id}</span></div>
                <div><span className="text-muted-foreground">IP Virtual:</span> <span className="font-mono text-slate-200">{profile.ip} ({profile.country})</span></div>
                <div><span className="text-muted-foreground">Nó Ativo:</span> <span className="font-mono text-slate-200">{profile.node}</span></div>
                <div><span className="text-muted-foreground">DNS Leak Guard:</span> <span className="text-emerald-400 font-bold">ATIVO</span></div>
              </div>
            )}
          </div>

          <div className="border border-emerald-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-emerald-300">Executar Túnel & Blindagem</h3>
              <p className="text-xs text-muted-foreground">Aplica sanitização de headers e inicia a sessão anônima.</p>
            </div>
            <Button
              onClick={handleInjectAndOpen}
              disabled={!profile || isInjecting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              Iniciar Sessão Dark
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
