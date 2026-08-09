import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { UniversalDeviceProfile, generateUniversalDevice } from '@/lib/universalDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function TemuManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO para Temu (preços de app & cupons de novo usuário)
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableCouponBypass, setEnableCouponBypass] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Temu')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice('temu');
    setDevice(newDev);
    saveAccountRecord({
      id: `temu_${Date.now()}`,
      email: `temu_${newDev.fingerprint}@local.test`,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: newDev.fingerprint,
      userAgent: newDev.userAgent,
      personalData: { name: newDev.deviceName, phone: '', birthDate: '', city: '', state: '' },
      behaviorConfig: { minDelay: 600, maxDelay: 2500, typingSpeed: 130 },
      notes: 'Temu — perfil técnico gerado localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Temu gerado com simulação de app de compras e cupons!');
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um dispositivo Temu primeiro!');
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
        ? generateNativeAppSimulationForProfile({ platform: 'temu', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
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
        ...(simulateNativeApp ? ['Simulação App Temu (WebView Shopping)'] : []),
        ...(enableCouponBypass ? ['Bypass de Cupons Novo Usuário'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Executa motor anti-detecção avançado (16+ ferramentas)
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView Temu e Bridge\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

            ${enableCouponBypass ? `
              // 3. Injeção de cupons e flags de novo usuário Temu
              window.__TEMU_NEW_USER_PROMO__ = true;
              window.__TEMU_DISCOUNT_MULTIPLIER__ = 0.5;
              localStorage.setItem('temu_new_user', 'true');
              localStorage.setItem('temu_coupon_pack', 'ACTIVE_100_OFF');
            ` : ''}

            ${enableHumanBehavior ? `// 4. Comportamento humano simulado\n${behaviorCode}` : ''}

            // 5. Injeta perfil de hardware
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('temu_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);

            console.log('%c✓ Temu Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #ff6600; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #ff6600; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛍️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">TEMU APP SIMULATOR & BYPASS ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para a Temu...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://www.temu.com';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção Temu:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar Temu: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando Temu App...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ff6600; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">🛍️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #ff6600;">Injetando Temu Bridge & App Fingerprint...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção Temu disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção Temu');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-orange-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>E-commerce Mobile & App Nativo</span>
            </div>
            <h1 className="text-3xl font-extrabold text-orange-400">TEMU DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Suite anti-detecção avançada para Temu com simulação de app nativo e bypass de preços de aplicativo</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['temu']} accentClass="text-orange-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-orange-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Perfil Técnico Temu
            </h2>
              <p className="text-xs text-muted-foreground mb-2">Histórico local Temu: <span className="text-orange-300 font-bold">{historyCount} perfil(is)</span></p>
              <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com IMEI, MAC, Android ID, resolução e User-Agent otimizados para o ecossistema Temu.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Dispositivo Temu
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-orange-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-orange-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-orange-200 break-all">{device.userAgent}</div></div>
              </div>
            )}
          </div>

          <div className="border border-orange-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-orange-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-400" />
              2. Módulos de Proteção & Simulação de App
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-native" className="text-sm font-bold text-orange-200 cursor-pointer">
                    Simulação de App Nativo Temu (WebView Shopping & Bridge)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta objetos globais <code className="text-orange-400">TemuBridge</code> e propriedades de app móvel para habilitar descontos exclusivos de aplicativo e bypass anti-bot.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-coupon" checked={enableCouponBypass} onCheckedChange={(c) => setEnableCouponBypass(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-coupon" className="text-sm font-bold text-orange-200 cursor-pointer">
                    Bypass de Cupons & Promoções de Novo Usuário ($100 Pack)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta flags de primeiro acesso para destravar pacotes de cupons e promoções relâmpago de aplicativo na sessão.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="temu-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="temu-human" className="text-sm font-bold text-orange-200 cursor-pointer">
                    Simulação de Comportamento Humano (Delays, Mouse & Scroll)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Emula micro-movimentos e cadência natural para evitar bloqueios comportamentais.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-orange-500/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {device ? '✓ Perfeito! Dispositivo gerado e pronto para injeção.' : '⚠️ Gere um dispositivo na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir Temu com Blindagem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
