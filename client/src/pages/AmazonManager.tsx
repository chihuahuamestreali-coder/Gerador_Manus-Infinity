import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateAmazonDeviceProfile, AmazonDeviceProfile } from '@/lib/amazonDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Package, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function AmazonManager() {
  const [, setLocation] = useLocation();
  const [device, setDevice] = useState<AmazonDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  // Simulação de App Nativo — ATIVADA POR PADRÃO (pedido do usuário)
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableDeviceTokens, setEnableDeviceTokens] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('Amazon')).length);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateAmazonDeviceProfile();
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `amz_${Date.now()}`,
      email: newPerson.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: newDev.fingerprint,
      userAgent: newDev.userAgent,
      personalData: {
        name: newPerson.fullName,
        phone: newPerson.phone,
        birthDate: newPerson.birthDate,
        city: newPerson.city,
        state: newPerson.state,
      },
      behaviorConfig: { minDelay: 800, maxDelay: 3000, typingSpeed: 120 },
      notes: 'Amazon — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil Amazon gerado com dispositivo e persona!', {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const handleInjectAndOpen = async () => {
    if (!device) {
      toast.error('Gere um perfil Amazon primeiro!');
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
        ? generateNativeAppSimulationForProfile({ platform: 'amazon', userAgent: device.userAgent, imei: device.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 800, maxDelay: 3000, minTypingSpeed: 70, maxTypingSpeed: 180, enableMouseMovement: true, enableScrolling: true })
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
        ubidToken: device.ubidToken,
        amazonDeviceToken: device.amazonDeviceToken,
        locale: device.locale,
        timezone: device.timezone,
      }).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(simulateNativeApp ? ['Simulação App Amazon (WebView Shopping)'] : []),
        ...(enableDeviceTokens ? ['Tokens de Device Amazon (ubid + device token)'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Executa motor anti-detecção avançado (16+ ferramentas)
            ${antiDetectionCode}

            ${simulateNativeApp ? `// 2. SIMULAÇÃO DE APP NATIVO — WebView Amazon e Bridge\n${appSimCode}` : '// 2. Simulação de app nativo DESATIVADA'}

            ${enableHumanBehavior ? `// 3. Comportamento humano simulado\n${behaviorCode}` : ''}

            // 4. Injeta perfil de hardware + tokens de device da Amazon
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('amazon_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_model', profile.model);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_amazon_ubid', profile.ubidToken);
            localStorage.setItem('_amazon_device_token', profile.amazonDeviceToken);

            console.log('%c✓ Amazon Device & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #ff9900; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; font-family: monospace; color: #ff9900; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">AMAZON BLINDAGEM & APP SIMULATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px;">${enabledFeatures.join(' • ')}<br/>Redirecionando para a Amazon...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = 'https://www.amazon.com.br/';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção Amazon:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar Amazon: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando Amazon...</title>
          <style>
            body { margin: 0; padding: 0; background: #0a0e27; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #ff9900; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">🛡️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #ff9900;">Injetando Amazon Device & Anti-Fraud Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção Amazon disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção Amazon');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-amber-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>E-commerce Global & Anti-Fraud</span>
            </div>
            <h1 className="text-3xl font-extrabold text-amber-400">AMAZON DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Suite anti-detecção avançada para Amazon com blindagem de device tokens e abertura direta no cadastro</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['amazon']} accentClass="text-amber-300" />

        <div className="grid gap-6 mt-8">
          <div className="border border-amber-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Perfil Técnico + Persona Amazon
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local Amazon: <span className="text-amber-300 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um dispositivo móvel realista com IMEI, MAC, Android ID, tokens ubid-main/device da Amazon e uma persona sintética completa para a tela de cadastro.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Perfil Amazon
            </Button>

            {device && (
              <div className="mt-6 p-4 rounded-xl bg-background/80 border border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground">Dispositivo:</span> <span className="font-bold text-amber-300">{device.deviceName} ({device.model})</span></div>
                <div><span className="text-muted-foreground">IMEI:</span> <span className="font-mono text-slate-200">{device.imei}</span></div>
                <div><span className="text-muted-foreground">MAC Address:</span> <span className="font-mono text-slate-200">{device.macAddress}</span></div>
                <div><span className="text-muted-foreground">ubid Token:</span> <span className="font-mono text-slate-200">{device.ubidToken}</span></div>
                <div><span className="text-muted-foreground">Fingerprint:</span> <span className="font-mono text-slate-200">{device.fingerprint}</span></div>
                <div><span className="text-muted-foreground">Timezone/Locale:</span> <span className="text-slate-200">{device.timezone} / {device.locale}</span></div>
                <div className="md:col-span-2"><span className="text-muted-foreground">User-Agent:</span> <div className="p-2 mt-1 rounded bg-slate-950 font-mono text-[11px] text-amber-200 break-all">{device.userAgent}</div></div>
              </div>
            )}

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-amber-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-amber-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-amber-300 hover:bg-amber-500/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-amber-200">{personalData.fullName}</span></div>
                    <div><span className="text-muted-foreground">Email:</span> <span className="font-mono text-slate-200">{personalData.email}</span></div>
                    <div><span className="text-muted-foreground">Telefone:</span> <span className="font-mono text-slate-200">{personalData.phone}</span></div>
                    <div><span className="text-muted-foreground">Nascimento:</span> <span className="text-slate-200">{personalData.birthDate}</span></div>
                    <div><span className="text-muted-foreground">CPF:</span> <span className="font-mono text-slate-200">{personalData.cpf}</span></div>
                    <div><span className="text-muted-foreground">Cidade/UF:</span> <span className="text-slate-200">{personalData.city} / {personalData.state}</span></div>
                    <div className="md:col-span-2"><span className="text-muted-foreground">Endereço:</span> <span className="text-slate-200">{personalData.address.street}, {personalData.address.number} — {personalData.address.neighborhood}, {personalData.zipCode}</span></div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Clique em "Revelar" para ver a persona sintética gerada (dados fictícios de teste).</p>
                )}
              </div>
            )}
          </div>

          <div className="border border-amber-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-amber-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              2. Módulos de Proteção & Simulação de App
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="amz-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="amz-native" className="text-sm font-bold text-amber-200 cursor-pointer">
                    Simulação de App Nativo Amazon (WebView Shopping & Bridge)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta objetos globais <code className="text-amber-400">AmazonBridge</code> e propriedades de app móvel para contornar a detecção "navegador vs app nativo".
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="amz-tokens" checked={enableDeviceTokens} onCheckedChange={(c) => setEnableDeviceTokens(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="amz-tokens" className="text-sm font-bold text-amber-200 cursor-pointer">
                    Tokens de Device Amazon (ubid-main & device token persistentes)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Gera tokens ubid-main e session-id sintéticos para manter consistência de sessão frente ao rastreamento de device da Amazon.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="amz-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="amz-human" className="text-sm font-bold text-amber-200 cursor-pointer">
                    Simulação de Comportamento Humano (Delays, Mouse & Scroll)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Emula micro-movimentos e cadência natural para evitar detecção comportamental do Amazon Fraud Detector.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {device ? '✓ Perfeito! Perfil gerado e pronto para injeção.' : '⚠️ Gere um perfil na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!device || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir Cadastro Amazon com Blindagem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
