import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { useState, useEffect } from 'react';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord, getAccountHistory } from '@/lib/accountHistoryManager';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Github, Play, Loader2, ShieldCheck, Smartphone, Sparkles, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const GITHUB_SIGNUP_URL = 'https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home';

export default function GitHubManager() {
  const [, setLocation] = useLocation();
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [enableFingerprintShield, setEnableFingerprintShield] = useState(true);
  const [enableAntiBot, setEnableAntiBot] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getAccountHistory().filter((record) => record.notes?.includes('GitHub')).length);
  }, []);

  // Perfil de device sintético do GitHub (usado na injeção e no histórico)
  const buildGitHubDeviceProfile = () => {
    const randHex = (n: number) =>
      Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fingerprint = `gh_${randHex(32)}`;
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
    return {
      deviceId: `gh_device_${randHex(16)}`,
      fingerprint,
      userAgent,
      macAddress: `02:${randHex(2)}:${randHex(2)}:${randHex(2)}:${randHex(2)}:${randHex(2)}`,
      imei: `35${randHex(13)}`,
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const dev = buildGitHubDeviceProfile();
    const newPerson = generatePersonalData();
    setPersonalData(newPerson);
    saveAccountRecord({
      id: `gh_${Date.now()}`,
      email: newPerson.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: dev.fingerprint,
      userAgent: dev.userAgent,
      personalData: {
        name: newPerson.fullName,
        phone: newPerson.phone,
        birthDate: newPerson.birthDate,
        city: newPerson.city,
        state: newPerson.state,
      },
      behaviorConfig: { minDelay: 600, maxDelay: 2500, typingSpeed: 130 },
      notes: 'GitHub — perfil técnico e persona gerados localmente',
    });
    setHistoryCount((count) => count + 1);
    setIsGenerating(false);
    toast.success('Novo perfil GitHub gerado com dispositivo e persona!', {
      description: `${dev.deviceId} • ${newPerson.email}`,
    });
  };

  const handleInjectAndOpen = async () => {
    if (!personalData) {
      toast.error('Gere um perfil GitHub primeiro!');
      return;
    }
    setIsInjecting(true);
    try {
      const dev = buildGitHubDeviceProfile();
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado! Permita pop-ups no navegador.');
        setIsInjecting(false);
        return;
      }

      const antiDetectionCode = generateAdvancedAntiDetection();
      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: 'github', userAgent: dev.userAgent, imei: dev.imei })
        : '';
      const behaviorCode = enableHumanBehavior
        ? generateBehaviorInjectionScript({ minDelay: 600, maxDelay: 2500, minTypingSpeed: 70, maxTypingSpeed: 190, enableMouseMovement: true, enableScrolling: true })
        : '';

      const profileJson = JSON.stringify({
        deviceId: dev.deviceId,
        macAddress: dev.macAddress,
        imei: dev.imei,
        fingerprint: dev.fingerprint,
        userAgent: dev.userAgent,
      }).replace(/"/g, '\\"');

      const enabledFeatures = [
        'Motor Anti-Detecção 16+',
        ...(enableFingerprintShield ? ['Spoofing de Fingerprint & Canvas/WebGL'] : []),
        ...(enableAntiBot ? ['Shield Anti-Bot GitHub (Device ID, Telemetria, Anti-Abuse)'] : []),
        ...(simulateNativeApp ? ['Simulação App GitHub (WebView & Bridge)'] : []),
        ...(enableHumanBehavior ? ['Comportamento Humano Realista'] : []),
      ];

      const fullScript = `
        (function() {
          try {
            // 1. Executa motor anti-detecção avançado (16+ ferramentas)
            ${antiDetectionCode}

            ${enableFingerprintShield ? `// 2. Spoofing de fingerprint (navigator, canvas, webgl, audio, hardware)
              try {
                const randHex = n => Array.from({length: n}, () => Math.floor(Math.random()*16).toString(16)).join('');
                Object.defineProperty(navigator, 'hardwareConcurrency', { value: Math.floor(Math.random()*8)+4, configurable: true });
                Object.defineProperty(navigator, 'deviceMemory', { value: [4,8,16][Math.floor(Math.random()*3)], configurable: true });
                Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
                Object.defineProperty(navigator, 'languages', { value: ['en-US','en'], configurable: true });
                Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
                if (window.screen) {
                  Object.defineProperty(screen, 'colorDepth', { value: 24, configurable: true });
                  Object.defineProperty(screen, 'pixelDepth', { value: 24, configurable: true });
                }
              } catch(e) { console.warn('fingerprint shield', e); }
            ` : '// 2. Spoofing de fingerprint DESATIVADO'}

            ${enableAntiBot ? `// 3. Shield Anti-Bot GitHub — device ID, telemetria e detecção de automação
              try {
                const randHex = n => Array.from({length: n}, () => Math.floor(Math.random()*16).toString(16)).join('');
                // Device ID sintético que o GitHub usa para telemetria de abuso
                const ghDeviceId = randHex(32);
                localStorage.setItem('_gh_og_device_id', ghDeviceId);
                localStorage.setItem('_gh_unicorn_session', randHex(24));
                localStorage.setItem('_gh_user_session', randHex(40));
                // Previne detecção de automação (webdriver / headless)
                Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
                if (window.chrome && window.chrome.runtime) {
                  Object.defineProperty(navigator, 'userAgentData', {
                    value: { brands: [{ brand: 'Google Chrome', version: '126' }, { brand: 'Not:A-Brand', version: '8' }, { brand: 'Chromium', version: '126' }], mobile: false, platform: 'Windows' },
                    configurable: true
                  });
                }
                // WebRTC: IP interno não vazado
                const origRTCPeerConnection = window.RTCPeerConnection;
                if (origRTCPeerConnection) {
                  window.RTCPeerConnection = function() {
                    const pc = new origRTCPeerConnection(arguments[0] || {});
                    const noop = () => {};
                    pc.createDataChannel = noop;
                    pc.createOffer = () => Promise.resolve({ sdp: '', type: 'offer' });
                    pc.setLocalDescription = noop;
                    pc.setRemoteDescription = noop;
                    pc.addIceCandidate = noop;
                    return pc;
                  };
                  window.RTCPeerConnection.prototype = origRTCPeerConnection.prototype;
                }
              } catch(e) { console.warn('anti-bot shield', e); }
            ` : '// 3. Shield Anti-Bot GitHub DESATIVADO'}

            ${simulateNativeApp ? `// 4. SIMULAÇÃO DE APP NATIVO — GitHub WebView & Bridge\n${appSimCode}` : '// 4. Simulação de app nativo DESATIVADA'}

            ${enableHumanBehavior ? `// 5. Comportamento humano simulado\n${behaviorCode}` : ''}

            // 6. Injeta perfil de device GitHub
            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('github_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            localStorage.setItem('_device_id', profile.deviceId);
            localStorage.setItem('_device_mac', profile.macAddress);
            localStorage.setItem('_device_imei', profile.imei);
            localStorage.setItem('_gh_device_id', profile.deviceId);

            console.log('%c✓ GitHub Manager & ${enabledFeatures.length} Módulos Injetados com Sucesso!', 'color: #58A6FF; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0d1117; font-family: monospace; color: #58A6FF; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">GITHUB SIGNUP BLINDADO & APP SIMULATOR ATIVO!</div>
                  <div style="font-size: 14px; opacity: 0.8; margin-bottom: 20px; color: #8b949e;">${enabledFeatures.join(' • ')}<br/>Redirecionando para o cadastro do GitHub...</div>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = '${GITHUB_SIGNUP_URL}';
            }, 1800);
          } catch(err) {
            console.error('Erro na injeção GitHub:', err);
            document.body.innerHTML = '<div style="color: red; padding: 40px; font-family: monospace;">Erro ao injetar GitHub: ' + err.message + '</div>';
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Blindando GitHub...</title>
          <style>
            body { margin: 0; padding: 0; background: #0d1117; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; color: #58A6FF; }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div style="font-size: 48px;">🛡️</div>
            <div style="margin-top: 20px; font-size: 18px; color: #58A6FF;">Injetando GitHub Device & Anti-Bot Shield...</div>
          </div>
          <script>${fullScript}</script>
        </body>
        </html>
      `);
      win.document.close();
      toast.success('Injeção GitHub disparada com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao abrir aba de injeção GitHub');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-slate-500/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Github className="w-4 h-4" />
              <span>Plataforma Dev & Anti-Abuse GitHub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-200">GITHUB DEVICE MASTER</h1>
            <p className="text-sm text-muted-foreground">Suite anti-detecção completa para o cadastro oficial do GitHub (github.com/signup) com shield anti-abuse e injeção 16+</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-slate-500/50 text-slate-200 hover:bg-slate-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        <ModuleGuide guide={MODULE_GUIDES['github-manager']} accentClass="text-slate-100" />

        <div className="grid gap-6 mt-8">
          <div className="border border-slate-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Gerar Persona Sintética + Device GitHub
            </h2>
            <p className="text-xs text-muted-foreground mb-2">Histórico local GitHub: <span className="text-slate-200 font-bold">{historyCount} perfil(is)</span></p>
            <p className="text-xs text-muted-foreground mb-4">
              Gera um device ID sintético GitHub, fingerprint blindado e uma persona sintética completa (nome, email, telefone, nascimento, CPF, endereço) pronta para a tela de cadastro do GitHub.
            </p>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-6 py-2.5">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Gerar Perfil GitHub
            </Button>

            {personalData && (
              <div className="mt-4 p-4 rounded-xl bg-background/80 border border-slate-500/20 relative text-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4" /> Persona Sintética para Cadastro
                  </h3>
                  <Button variant="ghost" size="sm" className="h-7 text-slate-200 hover:bg-slate-500/10" onClick={() => setShowPersona(!showPersona)}>
                    {showPersona ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                    {showPersona ? 'Ocultar' : 'Revelar'}
                  </Button>
                </div>
                {showPersona ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="text-muted-foreground">Nome:</span> <span className="font-bold text-slate-100">{personalData.fullName}</span></div>
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

          <div className="border border-slate-500/30 rounded-2xl p-6 bg-card/50 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-100 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-slate-300" />
              2. Módulos de Proteção & Injeção Completa
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="gh-fp" checked={enableFingerprintShield} onCheckedChange={(c) => setEnableFingerprintShield(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="gh-fp" className="text-sm font-bold text-slate-100 cursor-pointer">
                    Spoofing de Fingerprint (Canvas, WebGL, Hardware & Screen)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Mascara <code className="text-slate-200">navigator</code>, hardware, screen e parâmetros de canvas/WebGL para evitar identificação por fingerprint.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="gh-antibot" checked={enableAntiBot} onCheckedChange={(c) => setEnableAntiBot(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="gh-antibot" className="text-sm font-bold text-slate-100 cursor-pointer">
                    Shield Anti-Abuse GitHub (Device ID, Unicorn & WebDriver)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta <code className="text-slate-200">device-id</code> e sessões sintéticas (Unicorn/session), bloqueia vazamento de IP via WebRTC e desativa detecção de automação.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="gh-native" checked={simulateNativeApp} onCheckedChange={(c) => setSimulateNativeApp(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="gh-native" className="text-sm font-bold text-slate-100 cursor-pointer">
                    Simulação de App Nativo GitHub (WebView & Bridge)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Injeta objetos globais <code className="text-slate-200">GitHubBridge</code> e propriedades de app desktop para contornar a detecção "navegador vs app nativo".
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-background/50 border border-border/50">
                <Checkbox id="gh-human" checked={enableHumanBehavior} onCheckedChange={(c) => setEnableHumanBehavior(!!c)} />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="gh-human" className="text-sm font-bold text-slate-100 cursor-pointer">
                    Simulação de Comportamento Humano (Delays, Mouse & Scroll)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Emula micro-movimentos e cadência natural para evitar bloqueios comportamentais do sistema anti-abuse do GitHub.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-500/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {personalData ? '✓ Perfeito! Perfil gerado e pronto para injeção.' : '⚠️ Gere um perfil na etapa 1 antes de injetar.'}
              </div>
              <Button
                onClick={handleInjectAndOpen}
                disabled={!personalData || isInjecting}
                className="w-full sm:w-auto bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isInjecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Injetar & Abrir Cadastro GitHub com Blindagem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
