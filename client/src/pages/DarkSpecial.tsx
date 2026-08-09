import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import ModuleGuide from '@/components/ModuleGuide';
import { MODULE_GUIDES } from '@/lib/moduleGuides';
import { UniversalDeviceProfile, generateUniversalDevice } from '@/lib/universalDeviceGenerator';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { saveAccountRecord } from '@/lib/accountHistoryManager';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, ArrowLeft, Lock, Globe, Terminal, Cpu, Sparkles, ExternalLink, ShieldCheck, Zap, Bot, Eye, Key, MessageSquare, Heart, Copy, Play, Loader2, Skull } from 'lucide-react';
import { toast } from 'sonner';

type DarkTab = 'hub' | 'skynetchat' | 'deephat' | 'venice' | 'simplelogin' | 'nastia';

export default function DarkSpecial() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DarkTab>('hub');
  
  // States for device and injections per service
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  
  const [antiFraudMode, setAntiFraudMode] = useState(true);
  const [simulateNativeApp, setSimulateNativeApp] = useState(true);
  const [enableHumanBehavior, setEnableHumanBehavior] = useState(true);
  const [customParam, setCustomParam] = useState('');

  // Service URLs map
  const serviceUrls: Record<Exclude<DarkTab, 'hub'>, { name: string; url: string; icon: any; color: string; desc: string }> = {
    skynetchat: { name: 'SkynetChat', url: 'https://skynetchat.ai', icon: Bot, color: 'text-cyan-400', desc: 'Chat de IA descentralizado com blindagem de fingerprint e WebSocket encriptado.' },
    deephat: { name: 'DeepHat', url: 'https://deephat.ai', icon: Terminal, color: 'text-pink-500', desc: 'Plataforma de pesquisa de segurança e auditoria com isolamento de contexto.' },
    venice: { name: 'Venice AI', url: 'https://venice.ai', icon: Sparkles, color: 'text-sky-400', desc: 'IA privada e sem censura com spoofing completo de navegador e WebRTC guard.' },
    simplelogin: { name: 'SimpleLogin', url: 'https://app.simplelogin.io', icon: Key, color: 'text-emerald-400', desc: 'Gerenciador de aliases de email anônimos para cadastros blindados.' },
    nastia: { name: 'Nastia.ai', url: 'https://nastia.ai', icon: Heart, color: 'text-pink-400', desc: 'Plataforma de avatares e companheiros de IA com WebView móvel simulado.' },
  };

  const handleGenerate = async (serviceKey: string) => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const newDev = generateUniversalDevice(serviceKey);
    const newPerson = generatePersonalData();
    setDevice(newDev);
    setPersonalData(newPerson);
    
    saveAccountRecord({
      id: `${serviceKey}_${Date.now()}`,
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
      notes: `Dark Hub • ${serviceKey.toUpperCase()} — Perfil técnico e persona gerados`,
    });

    setIsGenerating(false);
    toast.success(`Perfil ${serviceKey.toUpperCase()} gerado com sucesso!`, {
      description: `${newDev.deviceName} • ${newPerson.email}`,
    });
  };

  const handleInjectAndOpen = (serviceKey: Exclude<DarkTab, 'hub'>) => {
    if (!device) {
      toast.error('Gere um perfil técnico primeiro!');
      return;
    }

    setIsInjecting(true);
    const target = serviceUrls[serviceKey];

    try {
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up bloqueado pelo navegador! Permita pop-ups.');
        setIsInjecting(false);
        return;
      }

      const antiDetectionCode = antiFraudMode ? generateAdvancedAntiDetection() : '';
      const appSimCode = simulateNativeApp
        ? generateNativeAppSimulationForProfile({ platform: serviceKey as any, userAgent: device.userAgent, imei: device.imei })
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
        personalData: personalData ? { name: personalData.fullName, email: personalData.email, phone: personalData.phone } : null,
      }).replace(/"/g, '\\"');

      const fullScript = `
        (function() {
          try {
            ${antiDetectionCode}
            ${appSimCode}
            ${behaviorCode}

            const profile = JSON.parse("${profileJson}");
            localStorage.setItem('${serviceKey}_device_profile', JSON.stringify(profile));
            localStorage.setItem('_device_fingerprint', profile.fingerprint);
            if (profile.personalData) {
              localStorage.setItem('${serviceKey}_persona', JSON.stringify(profile.personalData));
            }

            console.log('%c✓ ${target.name} • Perfil Blindado & Injeção Ativa!', 'color: #00d9ff; font-weight: bold; font-size: 16px;');

            document.body.innerHTML = \`
              <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #050508; font-family: monospace; color: #00d9ff; font-size: 24px; text-align: center; padding: 20px;">
                <div>
                  <div style="font-size: 64px; margin-bottom: 20px;">🛡️</div>
                  <div style="font-weight: bold; margin-bottom: 10px;">${target.name.toUpperCase()} • BLINDAGEM DARK ATIVA!</div>
                  <p style="font-size: 14px; color: #888; margin-bottom: 30px;">Dispositivo mascarado, headers sanitizados e sessão isolada com sucesso.</p>
                  <button onclick="window.location.href='${target.url}'" style="padding: 14px 28px; background: #00d9ff; color: #050508; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; font-family: monospace;">
                    ACESSAR ${target.name.toUpperCase()} AGORA →
                  </button>
                </div>
              </div>
            \`;

            setTimeout(() => {
              window.location.href = "${target.url}";
            }, 2500);
          } catch(err) {
            console.error('Erro na injeção Dark:', err);
            window.location.href = "${target.url}";
          }
        })();
      `;

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Dark Injector - ${target.name}</title>
          <meta charset="UTF-8">
          <style>
            body { background: #050508; color: #00d9ff; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { text-align: center; padding: 40px; border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 12px; background: rgba(10, 14, 39, 0.8); }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>🛡️ DARK SUITE • INJETANDO ${target.name.toUpperCase()}</h2>
            <p>Aplicando motor anti-detecção e simulador de app...</p>
            <script>${fullScript}</script>
          </div>
        </body>
        </html>
      `);
      win.document.close();
      setIsInjecting(false);
      toast.success(`Injeção executada para ${target.name}!`, { description: 'Redirecionando com sessão blindada.' });
    } catch (e) {
      console.error(e);
      setIsInjecting(false);
      toast.error('Erro ao abrir aba blindada.');
    }
  };

  const copyProfile = () => {
    if (!device || !personalData) return;
    const txt = `=== ${activeTab.toUpperCase()} DARK PROFILE ===\nDevice: ${device.deviceName}\nFingerprint: ${device.fingerprint}\nIMEI: ${device.imei}\nMAC: ${device.macAddress}\nUser-Agent: ${device.userAgent}\nName: ${personalData.fullName}\nEmail: ${personalData.email}\nPhone: ${personalData.phone}`;
    navigator.clipboard.writeText(txt);
    toast.success('Perfil copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#222] pb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Skull className="w-4 h-4" />
              <span>Dark Master Hub • 5 Serviços Exclusivos</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">DARK SUITE</h1>
            <p className="text-xs text-[#777]">Painel centralizado com SkynetChat, DeepHat, Venice AI, SimpleLogin e Nastia.ai</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline" className="border-[#333] bg-[#0a0a0a] text-white hover:bg-[#222] text-xs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Menu Principal
          </Button>
        </div>

        {/* Submenu Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <button
            onClick={() => { setActiveTab('hub'); setDevice(null); }}
            className={`p-3 rounded-xl border text-left transition-all ${activeTab === 'hub' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.2)]' : 'bg-[#0a0a0a] border-[#222] text-[#888] hover:border-[#444]'}`}
          >
            <div className="flex items-center gap-2 mb-1 font-bold text-xs">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Visão Geral</span>
            </div>
            <p className="text-[10px] opacity-70">Hub Dark Master</p>
          </button>

          {(Object.keys(serviceUrls) as Array<Exclude<DarkTab, 'hub'>>).map((key) => {
            const item = serviceUrls[key];
            const IconComp = item.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setDevice(null); setPersonalData(null); }}
                className={`p-3 rounded-xl border text-left transition-all ${isActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.2)]' : 'bg-[#0a0a0a] border-[#222] text-[#888] hover:border-[#444]'}`}
              >
                <div className="flex items-center gap-2 mb-1 font-bold text-xs">
                  <IconComp className={`w-4 h-4 ${item.color}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                <p className="text-[10px] opacity-70 truncate">Menu Protegido</p>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {activeTab === 'hub' ? (
          <div className="space-y-8">
            <ModuleGuide guide={MODULE_GUIDES['dark']} accentClass="text-cyan-400" />
            
            <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                Selecione um dos 5 Serviços Dark para Iniciar
              </h2>
              <p className="text-xs text-[#888] mb-6 leading-relaxed">
                Cada serviço abaixo possui um gerador de dispositivo exclusivo, simulação de aplicativo nativo e injeção automática de sessões blindadas e anti-detecção.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(serviceUrls) as Array<Exclude<DarkTab, 'hub'>>).map((key) => {
                  const item = serviceUrls[key];
                  const IconComp = item.icon;
                  return (
                    <div 
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className="bg-[#0e1224] border border-[#222] hover:border-cyan-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(0,217,255,0.15)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#050508] border border-[#333] flex items-center justify-center">
                            <IconComp className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                            DARK ACTIVE
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base mb-1">{item.name}</h3>
                        <p className="text-xs text-[#888] leading-relaxed mb-4">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#222] text-xs text-cyan-400 font-bold">
                        <span>Acessar Gerador</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ModuleGuide guide={MODULE_GUIDES[activeTab]} accentClass="text-cyan-400" />

            {/* Service Generator Panel */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#222]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#050508] border border-[#333] flex items-center justify-center">
                    {(() => {
                      const IconC = serviceUrls[activeTab].icon;
                      return <IconC className={`w-6 h-6 ${serviceUrls[activeTab].color}`} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {serviceUrls[activeTab].name} Manager
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Secure Dark Mode
                      </span>
                    </h2>
                    <p className="text-xs text-[#888]">{serviceUrls[activeTab].desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleGenerate(activeTab)}
                    disabled={isGenerating}
                    className="bg-cyan-500 hover:bg-cyan-400 text-[#050508] font-bold text-xs px-5 py-2.5"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Gerar Perfil Técnico
                  </Button>
                </div>
              </div>

              {/* Toggles / Protections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-[#0e1224] border border-[#222] p-4 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={antiFraudMode} onCheckedChange={(val) => setAntiFraudMode(!!val)} />
                  <div className="text-xs">
                    <p className="font-bold text-white">Motor Anti-Detecção (16+)</p>
                    <p className="text-[10px] text-[#777]">Spoofing de WebRTC, Canvas e AudioContext</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={simulateNativeApp} onCheckedChange={(val) => setSimulateNativeApp(!!val)} />
                  <div className="text-xs">
                    <p className="font-bold text-white">Simulação de App Nativo</p>
                    <p className="text-[10px] text-[#777]">Injeta bridge e User-Agent otimizado</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={enableHumanBehavior} onCheckedChange={(val) => setEnableHumanBehavior(!!val)} />
                  <div className="text-xs">
                    <p className="font-bold text-white">Comportamento Humano</p>
                    <p className="text-[10px] text-[#777]">Simula digitação e movimentação de mouse</p>
                  </div>
                </label>
              </div>

              {/* Device and Persona Display */}
              {device && personalData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hardware Info */}
                    <div className="bg-[#050508] border border-[#222] p-5 rounded-xl">
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Perfil de Hardware & Fingerprint
                      </h3>
                      <div className="space-y-2 text-xs text-[#ccc]">
                        <p><strong className="text-white">Dispositivo:</strong> {device.deviceName} ({device.manufacturer} {device.model})</p>
                        <p><strong className="text-white">Fingerprint:</strong> <span className="font-mono text-cyan-300">{device.fingerprint}</span></p>
                        <p><strong className="text-white">IMEI / Device ID:</strong> <span className="font-mono">{device.imei}</span></p>
                        <p><strong className="text-white">MAC Address:</strong> <span className="font-mono">{device.macAddress}</span></p>
                        <p><strong className="text-white">Resolução:</strong> {device.resolution}</p>
                      </div>
                    </div>

                    {/* Persona / Credential Info */}
                    <div className="bg-[#050508] border border-[#222] p-5 rounded-xl">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Dados de Persona & Credenciais
                      </h3>
                      <div className="space-y-2 text-xs text-[#ccc]">
                        <p><strong className="text-white">Nome Completo:</strong> {personalData.fullName}</p>
                        <p><strong className="text-white">Email Gerado:</strong> <span className="font-mono text-emerald-300">{personalData.email}</span></p>
                        <p><strong className="text-white">Telefone:</strong> {personalData.phone}</p>
                        <p><strong className="text-white">Data de Nasc.:</strong> {personalData.birthDate}</p>
                        <p><strong className="text-white">Localização:</strong> {personalData.city}, {personalData.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#222]">
                    <Button
                      onClick={copyProfile}
                      variant="outline"
                      className="border-[#333] bg-[#050508] text-white hover:bg-[#222] text-xs"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Dados do Perfil
                    </Button>

                    <Button
                      onClick={() => handleInjectAndOpen(activeTab as Exclude<DarkTab, 'hub'>)}
                      disabled={isInjecting}
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-[#050508] font-extrabold text-xs px-6 py-3 shadow-[0_0_30px_rgba(0,217,255,0.3)]"
                    >
                      {isInjecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      INJETAR E ABRIR {serviceUrls[activeTab].name.toUpperCase()} →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-[#050508] border border-[#222] rounded-xl">
                  <Cpu className="w-12 h-12 text-[#444] mx-auto mb-3 animate-pulse" />
                  <p className="text-sm font-bold text-white mb-1">Nenhum perfil gerado para este serviço</p>
                  <p className="text-xs text-[#777] mb-4">Clique em "Gerar Perfil Técnico" para criar credenciais e fingerprint blindados.</p>
                  <Button
                    onClick={() => handleGenerate(activeTab)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-[#050508] font-bold text-xs"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Perfil Agora
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
