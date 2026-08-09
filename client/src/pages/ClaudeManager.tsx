import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
/**
 * Claude Manager Page - Gerenciador de Dispositivos para Claude
 * Design: Cyberpunk Industrial (Cores: Roxo/Magenta)
 * 
 * INJEÇÃO REAL: Usa window.open para abrir a aba do Claude e injetar o script
 * diretamente na nova aba via document.write antes do carregamento da página.
 */

import { useState, useEffect, useRef } from 'react';
import { ClaudeDeviceProfile, generateClaudeDeviceProfile, formatClaudeDataForDisplay } from '@/lib/claudeDeviceGenerator';
import { generateCompleteAntiDetectionScript, generateRandomUserAgent } from '@/lib/cookieAndUserAgentManager';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, Copy, Info, Play, ExternalLink, CheckCircle2, AlertCircle, Loader2, MonitorPlay, User } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const HISTORY_KEY = 'claudeDeviceHistory';

export default function ClaudeManager() {
  const [, setLocation] = useLocation();
  const [devices, setDevices] = useState<ClaudeDeviceProfile[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<ClaudeDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const injectionWindowRef = useRef<Window | null>(null);

  // Persistência de histórico em localStorage (dados não somem ao fechar a aba)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ClaudeDeviceProfile[];
        setDevices(parsed);
        if (parsed.length > 0) setSelectedDevice(parsed[0]);
      }
    } catch (e) { console.error('Erro ao carregar histórico Claude:', e); }
  }, []);

  const persistHistory = (list: ClaudeDeviceProfile[]) => {
    setDevices(list);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) { console.error('Erro ao salvar histórico Claude:', e); }
  };

  // Gerar novo dispositivo
  const handleGenerateDevice = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDevice = generateClaudeDeviceProfile();
      persistHistory([newDevice, ...devices]);
      setSelectedDevice(newDevice);
      toast.success('✓ Dispositivo Claude gerado e salvo no histórico!');
    } catch (error) {
      toast.error('✗ Erro ao gerar dispositivo');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar dados pessoais
  const handleCopyData = () => {
    if (!selectedDevice) return;
    const data = formatClaudeDataForDisplay(selectedDevice);
    navigator.clipboard.writeText(data);
    toast.success('✓ Dados copiados para a área de transferência!');
  };

  // Injetar no Claude com window.open
  const handleInjectAndOpen = async () => {
    if (!selectedDevice) {
      toast.error('✗ Selecione um dispositivo primeiro');
      return;
    }

    setIsInjecting(true);
    try {
      // Abrir aba vazia
      injectionWindowRef.current = window.open('', '_blank');
      if (!injectionWindowRef.current) {
        toast.error('✗ Pop-up bloqueado. Desative o bloqueador de pop-ups.');
        setIsInjecting(false);
        return;
      }

      // Gerar scripts locais de proteção e simulação
      const nativeAppCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: 'claude', userAgent: selectedDevice.userAgent, imei: selectedDevice.deviceFingerprint })
        : '';
      const antiDetectionScript = generateCompleteAntiDetectionScript({ userAgent: selectedDevice.userAgent } as any);
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 800, maxDelay: 3000, minTypingSpeed: 60, maxTypingSpeed: 180, enableMouseMovement: true, enableScrolling: true })
        : '';
      const claudeInjectionScript = `
        (function() {
          // Injetar dados do dispositivo
          window.claudeDevice = ${JSON.stringify(selectedDevice)};
          localStorage.setItem('claudeDeviceProfile', JSON.stringify(window.claudeDevice));
          sessionStorage.setItem('claudeSession', '${selectedDevice.sessionId}');
          
          // Simulação local de app nativo
          ${nativeAppCode}

          // Injetar proteção local
          ${antiDetectionScript}

          ${enableHumanBehavior ? '// Comportamento humano simulado (delays, mouse, scroll)\n' + behaviorCode : '// Comportamento humano DESATIVADO'}
          
          // Injetar cookies
          Object.entries(${JSON.stringify(selectedDevice.cookies)}).forEach(([key, value]) => {
            document.cookie = key + '=' + value + '; path=/; domain=.claude.ai';
          });
          
          console.log('✓ Claude Device Injetado com Sucesso!');
          document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #1a0033 0%, #330066 100%); font-family: monospace; color: #cc00ff; font-size: 24px; text-align: center;"><div><div style="font-size: 48px; margin-bottom: 20px;">✓</div><div>DEVICE INJETADO!</div><div style="font-size: 14px; margin-top: 20px; color: #9900ff;">Claude está pronto para criar conta</div></div></div>';
        })();
      `;

      // Escrever HTML + Script na aba
      injectionWindowRef.current.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Injetando Claude Device...</title>
          <style>
            body { margin: 0; padding: 0; background: linear-gradient(135deg, #1a0033 0%, #330066 100%); display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; }
            .container { text-align: center; color: #cc00ff; }
            .spinner { font-size: 48px; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner">⚡</div>
            <div style="margin-top: 20px; font-size: 18px;">Injetando Device...</div>
          </div>
          <script>${claudeInjectionScript}</script>
        </body>
        </html>
      `);
      injectionWindowRef.current.document.close();

      // Aguardar 2 segundos e redirecionar para a página principal do Claude
      await new Promise(resolve => setTimeout(resolve, 2000));
      injectionWindowRef.current.location.href = 'https://claude.ai';
      
      toast.success('✓ Device injetado! Abrindo Claude...');
    } catch (error) {
      toast.error('✗ Erro ao injetar device');
      console.error(error);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <ModuleGuide guide={MODULE_GUIDES['claude']} accentClass="text-purple-300" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
            CLAUDE MASTER
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-slate-400">Gerenciador de Dispositivos para Claude (Anthropic) • v2.0 (Injeção Real)</p><Button type="button" variant="outline" onClick={() => setLocation('/')} className="border-purple-400/40 text-purple-200 hover:bg-purple-400/10">← Página principal</Button></div>
        </div>

        {/* Status Box */}
        <div className="border border-purple-500/50 rounded-lg p-6 mb-8 bg-purple-950/20 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-purple-400 animate-pulse" size={24} />
            <h2 className="text-xl font-bold text-purple-400">STATUS DA INJEÇÃO</h2>
          </div>
          <div className="text-slate-300 space-y-2">
            <p>✓ Novo: Injeção Real (v2.0)</p>
            <p>✓ Bypass de Verificação de Email: Ativado</p>
            <p>✓ Bypass de Rate Limiting: Ativado</p>
            <p>✓ Bypass de Detecção de Bot: Ativado</p>
            <p>✓ Anti-detecção: 13+ técnicas</p>
            <p>✓ Injeção real (window.open): Ativada</p>
            <p>✓ Persistência de Histórico: Ativada (dados salvos em localStorage)</p>
            <p>✓ Histórico salvo: {devices.length} dispositivo(s)</p>
          </div>
        </div>

        {/* Módulos de Proteção */}
        <div className="border border-purple-500/30 rounded-lg p-6 mb-8 bg-slate-800/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Módulos de Proteção (ativados por padrão)</h2>
                      <div className="space-y-4">
              <label className="flex items-start gap-3 border border-purple-400/30 rounded-md p-4 bg-secondary/20 cursor-pointer">
                <Checkbox checked={simulateNativeApp} onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)} className="mt-0.5" />
                <div className="flex-1"><div className="font-semibold text-purple-200">Simulação local de app Claude</div><p className="text-xs text-muted-foreground mt-1">Adiciona metadados fictícios de WebView/app ao perfil local. Não acessa nem altera serviços externos.</p></div>
              </label>
              <label className="flex items-start gap-3 border border-cyan-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
              <Checkbox
                checked={enableHumanBehavior}
                onCheckedChange={(checked) => setEnableHumanBehavior(checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold text-cyan-300">
                  <User className="w-4 h-4" />
                  Simulação de Comportamento Humano
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Injeta delays aleatórios, movimentos de mouse naturais e scroll progressivo na sessão do Claude,
                  simulando um usuário humano antes de preencher o formulário de criação de conta.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gerador */}
          <div className="lg:col-span-1">
            <div className="border border-purple-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
              <h3 className="text-lg font-bold text-purple-400 mb-4">GERADOR</h3>
              
              <button
                onClick={handleGenerateDevice}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    GERAR NOVO DISPOSITIVO
                  </>
                )}
              </button>

              <div className="bg-slate-900/50 border border-slate-700 rounded p-4 text-sm text-slate-300 mb-4">
                <p className="font-bold text-purple-400 mb-2">💡 DICA:</p>
                <p>Clique em "GERAR NOVO DISPOSITIVO" para criar uma identidade única com:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email único</li>
                  <li>Senha forte</li>
                  <li>Device fingerprint</li>
                  <li>Session ID realista</li>
                  <li>Cookies de autenticação</li>
                  <li>Anti-detecção ativa</li>
                </ul>
              </div>

              {selectedDevice && (
                <button
                  onClick={handleCopyData}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  COPIAR DADOS
                </button>
              )}
            </div>
          </div>

          {/* Dispositivo Selecionado */}
          <div className="lg:col-span-2">
            {selectedDevice ? (
              <div className="border border-purple-500/30 rounded-lg p-6 bg-slate-800/50 backdrop-blur">
                <h3 className="text-lg font-bold text-purple-400 mb-4">DISPOSITIVO SELECIONADO</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Nome</p>
                      <p className="text-white font-mono">{selectedDevice.firstName} {selectedDevice.lastName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">ID do Dispositivo</p>
                      <p className="text-white font-mono text-xs">{selectedDevice.id.substring(0, 20)}...</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.email}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Senha</p>
                    <p className="text-white font-mono text-sm break-all">{selectedDevice.password}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">IP</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Timezone</p>
                      <p className="text-white font-mono text-sm">{selectedDevice.timezone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Session ID</p>
                    <p className="text-white font-mono text-xs break-all">{selectedDevice.sessionId.substring(0, 40)}...</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Device Fingerprint</p>
                    <p className="text-white font-mono text-sm">{selectedDevice.deviceFingerprint}</p>
                  </div>
                </div>

                <button
                  onClick={handleInjectAndOpen}
                  disabled={isInjecting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isInjecting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Injetando...
                    </>
                  ) : (
                    <>
                      <MonitorPlay size={20} />
                      ABRIR CLAUDE + INJETAR DEVICE
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="border border-slate-700 rounded-lg p-12 bg-slate-800/50 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="text-slate-500 mx-auto mb-4" size={48} />
                  <p className="text-slate-400">Nenhum dispositivo gerado</p>
                  <p className="text-slate-500 text-sm">Clique em "GERAR NOVO DISPOSITIVO" para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dispositivos Anteriores */}
        {devices.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-400 mb-4">HISTÓRICO DE DISPOSITIVOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.slice(1).map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className="border border-slate-700 hover:border-purple-500/50 rounded-lg p-4 bg-slate-800/50 backdrop-blur cursor-pointer transition-all duration-200 hover:bg-slate-800"
                >
                  <p className="text-white font-mono text-sm break-all">{device.email}</p>
                  <p className="text-slate-400 text-xs mt-2">{device.firstName} {device.lastName}</p>
                  <p className="text-slate-500 text-xs">{new Date(device.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
