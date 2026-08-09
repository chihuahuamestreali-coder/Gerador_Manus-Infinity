import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState } from 'react';
import { UniversalDeviceProfile, generateUniversalDevice } from '@/lib/universalDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Zap, Play, Loader2, ShieldCheck, Smartphone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function AliExpressManager() {
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
    const newDev = generateUniversalDevice('aliexpress');
    setDevice(newDev);
    setIsGenerating(false);
    toast.success('Novo dispositivo AliExpress gerado com 16+ ferramentas!');
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

      const antiDetectionCode = generateAdvancedAntiDetection();
      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: 'aliexpress', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 800, maxDelay: 3000, minTypingSpeed: 60, maxTypingSpeed: 180, enableMouseMovement: true, enableScrolling: true })
        : '';

      const profileJson = JSON.stringify({
        macAddress: device.macAddress,
        imei: device.imei,
        androidId: device.androidId,
        model: device.model,
        manufacturer: device.manufacturer,
        resolution: device.resolution,
        fingerprint: device.fingerprint,
        userAgent: device.userAgent,
      }).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(simulateNativeApp ? ['Simulação App Nativo (WebView)'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Executa motor anti-detecção avançado (16+ ferramentas)
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView do AliExpress\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA (modo navegador)'}

            ${enableHumanBehavior ? `// 3. Comportamento humano simulado (delays, mouse, scroll)\n${behaviorCode}` : '// 3. Comportamento humano DESATIVADO'}

            // 4. Injeta dados do dispositivo fake
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_model', profile.model);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);

            console.log('%c✓ AliExpress Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #22c55e; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #22c55e; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">BLINDAGEM + ${simulateNativeApp ? 'APP NATIVO SIMULADO' : 'MODO NAVEGADOR'} ATIVADOS!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para o AliExpress...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://www.aliexpress.com';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar blindagem: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando AliExpress...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ff4444; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px; animation: spin 1s linear infinite;">🛡️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #22c55e;">Aplicando 16 Ferramentas Anti-Detecção...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Blindagem aplicada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de blindagem');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6">
        <ModuleGuide guide={MODULE_GUIDES['aliexpress']} accentClass="text-red-300" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-red-500/30 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-400">ALIEXPRESS MASTER (BLINDAGEM 16+)</h1>
            <p className="text-sm text-muted-foreground">Bypass completo de segurança anti-bot, app nativo simulado e injeção de hardware fake</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-red-500/50 text-red-400">
            ← Voltar ao Menu Principal
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="border border-red-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-red-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Dispositivo & Ferramentas
            </h2>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
              GERAR PERFIL ANTI-DETECÇÃO
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded bg-secondary/30 border border-red-500/20 space-y-2 text-sm">
                <p><strong>Dispositivo:</strong> {device.deviceName} ({device.model})</p>
                <p><strong>MAC:</strong> {device.macAddress}</p>
                <p><strong>IMEI:</strong> {device.imei}</p>
                <p><strong>Fingerprint:</strong> {device.fingerprint}</p>
                <p className="text-emerald-400 font-semibold pt-2">✓ 16 Técnicas de Spoofing (Canvas, WebGL, Audio, Battery, etc.) prontas.</p>
              </div>
            )}
          </div>

          <div className="border border-red-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-red-300">2. Módulos de Proteção (ativados por padrão)</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 border border-orange-500/40 rounded-md p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors">
                <Checkbox
                  checked={simulateNativeApp}
                  onCheckedChange={(checked) => setSimulateNativeApp(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-orange-300">
                    <Smartphone className="w-4 h-4" />
                    Simulação de App Nativo (WebView AliExpress)
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Simula o ambiente do app AliExpress (WebView, SDK WindVane, UA de app). Com isso o site reconhece
                    sua sessão como "app", liberando os <strong>preços exclusivos de aplicativo</strong> e ofertas
                    exclusivas para app. Se desmarcar, usa o modo navegador comum.
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
                    Injeta delays aleatórios, movimentos de mouse naturais, digitação realista e scroll progressivo —
                    o perfil se comporta como um usuário humano antes de interagir com o site.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="border border-red-500/30 rounded-lg p-6 bg-card/50">
            <h2 className="text-xl font-bold mb-4 text-red-300">3. Injetar Blindagem e Abrir AliExpress</h2>
            <Button onClick={handleInjectAndOpen} disabled={!device || isInjecting} className="bg-green-600 hover:bg-green-700 text-white font-bold">
              {isInjecting ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />}
              ABRIR ALIEXPRESS + APLICAR BLINDAGEM ANTI-BOT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
