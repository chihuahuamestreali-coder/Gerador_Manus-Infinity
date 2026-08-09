import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { UniversalDeviceProfile, generateUniversalDevice, generateDirectInjectionScript } from '@/lib/universalDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Zap, Play, CheckCircle2, Loader2, Smartphone, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function InstagramManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO (pedido do usuário)
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('instagram');
    setDevice(newDev);
    setIsGenerating(false);
    toast.success('Novo dispositivo Instagram gerado com app nativo simulado!');
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um dispositivo primeiro!');
      return;
    }

    setIsInjecting(true);
    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado! Permita pop-ups no navegador.');
        setIsInjecting(false);
        return;
      }

      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: 'instagram', userAgent: device.userAgent, imei: device.imei })
        : '';
      const antiDetectionCode = generateAdvancedAntiDetection();
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 800, maxDelay: 3000, minTypingSpeed: 60, maxTypingSpeed: 180, enableMouseMovement: true, enableScrolling: true })
        : '';

      const enabledFeatures = [
        'Injeção de Device',
        ...(simulateNativeApp ? ['Simulação App Nativo (WebView Instagram)'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
        'Anti-Detecção Avançada 16+',
      ];

      const script = `
        (function() {
          try {
            // 1. Injeta device e cookies
            ${generateDirectInjectionScript(device, 'https://www.instagram.com/accounts/emailsignup/', 'instagram', '#ec4899').replace(/\(function\(\)\s*\{/, '').replace(/\}\)\(\);\s*$/, '')}

            // 2. SIMULAÇÃO DE APP NATIVO — WebView do Instagram
            ${simulateNativeApp ? appSimCode : '// Simulação de app nativo DESATIVADA (modo navegador)'}

            // 3. Motor anti-detecção avançado (Canvas, WebGL, Audio, Battery, etc.)
            ${antiDetectionCode}

            // 4. Comportamento humano simulado (delays, mouse, scroll)
            ${enableHumanBehavior ? behaviorCode : '// Comportamento humano DESATIVADO'}

            console.log('%c✓ Instagram Device + ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #ec4899; font-weight: bold; font-size: 16px;');

            setTimeout(() => {
              window.location.href = 'https://www.instagram.com/accounts/emailsignup/';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar device: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Injetando Instagram Device...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ec4899; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px; animation: spin 1s linear infinite;">⚡</div>
            <div style="margin-top: 20px; font-size: 18px;">Injetando Device no Instagram ${simulateNativeApp ? '(App Nativo Simulado)' : ''}...</div>
          </div>
          <script>${script}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Device injetado com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6">
        <ModuleGuide guide={MODULE_GUIDES['instagram']} accentClass="text-pink-300" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-pink-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-pink-400">INSTAGRAM DEVICE MANAGER</h1>
            <p className="text-sm text-muted-foreground">Injeção direta, app nativo simulado e anti-detecção para Instagram</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-pink-500/50 text-pink-400">
            ← Voltar ao Início
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="border border-pink-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-pink-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Dispositivo
            </h2>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
              GERAR DISPOSITIVO INSTAGRAM
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded bg-secondary/30 border border-pink-500/20 space-y-2">
                <p><strong>Dispositivo:</strong> {device.deviceName} ({device.model})</p>
                <p><strong>MAC:</strong> {device.macAddress}</p>
                <p><strong>IMEI:</strong> {device.imei}</p>
                <p><strong>User-Agent:</strong> {device.userAgent}</p>
                <p className="text-emerald-400 font-semibold pt-2">✓ Device pronto + Anti-Detecção 16+ integrada.</p>
              </div>
            )}
          </div>

          <div className="border border-pink-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-pink-300">2. Módulos de Proteção (ativados por padrão)</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 border border-purple-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
                <Checkbox
                  checked={simulateNativeApp}
                  onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-purple-300">
                    <Smartphone className="w-4 h-4" />
                    Simulação de App Nativo (WebView Instagram)
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Injeta <code>window.InstagramWebView</code>, flags <code>isWebview</code>,
                    bridge <code>ReactNativeWebView</code> e User-Agent com a assinatura do app oficial.
                    O Instagram passa a reconhecer sua sessão como se fosse o app instalado no celular,
                    reduzindo drasticamente o risco de detecção de automação.
                  </p>
                </div>
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
                    Executa scrolls e movimentos de mouse aleatórios antes de você interagir,
                    simulando um usuário real "aquecendo" a sessão antes de logar.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-pink-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-pink-300">3. Injetar e Abrir Instagram</h2>
            <Button onClick={handleInjectAndOpen} disabled={!device || isInjecting} className="bg-green-600 hover:bg-green-700 text-white font-bold">
              {isInjecting ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
              ABRIR INSTAGRAM + INJETAR DEVICE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
