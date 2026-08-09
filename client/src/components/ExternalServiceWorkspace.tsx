import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clipboard, Cpu, ExternalLink, Fingerprint, KeyRound, Loader2, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ModuleGuide from '@/components/ModuleGuide';
import type { ModuleGuide as ModuleGuideData } from '@/lib/moduleGuides';
import { generateAdvancedAntiDetection } from '@/lib/advancedAntiDetection';
import { generateBehaviorInjectionScript } from '@/lib/humanBehaviorSimulator';
import { generateNativeAppSimulationForProfile } from '@/lib/nativeAppSimulator';
import { generatePersonalData } from '@/lib/personalDataGenerator';
import { UniversalDeviceProfile, generateUniversalDevice } from '@/lib/universalDeviceGenerator';
import { saveAccountRecord } from '@/lib/accountHistoryManager';
import type { ExternalServiceDefinition } from '@/lib/externalServiceCatalog';

type ExternalServiceWorkspaceProps = {
  service: ExternalServiceDefinition;
  guide: ModuleGuideData;
  modeLabel: string;
  onBack: () => void;
};

type LocalDiagnostics = {
  antiDetectionBundleSize: number;
  nativeAppBundleSize: number;
  behaviorBundleSize: number;
  generatedAt: string;
};

export default function ExternalServiceWorkspace({ service, guide, modeLabel, onBack }: ExternalServiceWorkspaceProps) {
  const [device, setDevice] = useState<UniversalDeviceProfile | null>(null);
  const [personalData, setPersonalData] = useState<ReturnType<typeof generatePersonalData> | null>(null);
  const [diagnostics, setDiagnostics] = useState<LocalDiagnostics | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [privacyChecklist, setPrivacyChecklist] = useState(true);
  const [nativeAppPreview, setNativeAppPreview] = useState(true);
  const [behaviorPlan, setBehaviorPlan] = useState(true);

  const handleGenerateLocalProfile = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 650));

    const nextDevice = generateUniversalDevice(service.key);
    const nextPersonalData = generatePersonalData();
    const antiDetectionBundle = privacyChecklist ? generateAdvancedAntiDetection() : '';
    const nativeAppBundle = nativeAppPreview
      ? generateNativeAppSimulationForProfile({
          platform: 'universal',
          userAgent: nextDevice.userAgent,
          imei: nextDevice.imei,
        })
      : '';
    const behaviorBundle = behaviorPlan
      ? generateBehaviorInjectionScript({
          minDelay: 800,
          maxDelay: 3000,
          minTypingSpeed: 70,
          maxTypingSpeed: 180,
          enableMouseMovement: true,
          enableScrolling: true,
        })
      : '';

    setDevice(nextDevice);
    setPersonalData(nextPersonalData);
    setDiagnostics({
      antiDetectionBundleSize: antiDetectionBundle.length,
      nativeAppBundleSize: nativeAppBundle.length,
      behaviorBundleSize: behaviorBundle.length,
      generatedAt: new Date().toISOString(),
    });

    try {
      localStorage.setItem(`device_master_local_profile_${service.key}`, JSON.stringify({
        service: service.name,
        destination: service.url,
        device: nextDevice,
        persona: {
          name: nextPersonalData.fullName,
          email: nextPersonalData.email,
          phone: nextPersonalData.phone,
        },
        generatedAt: new Date().toISOString(),
      }));
    } catch {
      // The workspace remains usable when browser storage is unavailable.
    }

    saveAccountRecord({
      id: `${service.key}_${Date.now()}`,
      email: nextPersonalData.email,
      createdAt: new Date(),
      status: 'pending',
      deviceFingerprint: nextDevice.fingerprint,
      userAgent: nextDevice.userAgent,
      personalData: {
        name: nextPersonalData.fullName,
        phone: nextPersonalData.phone,
        birthDate: nextPersonalData.birthDate,
        city: nextPersonalData.city,
        state: nextPersonalData.state,
      },
      behaviorConfig: { minDelay: 800, maxDelay: 3000, typingSpeed: 120 },
      notes: `${modeLabel} • ${service.name} — perfil sintético local para inspeção`,
    });

    setIsGenerating(false);
    toast.success(`Perfil local de ${service.name} preparado`, {
      description: 'Nenhum dado foi enviado ao site externo.',
    });
  };

  const handleCopySummary = async () => {
    if (!device || !personalData) return;
    const summary = [
      `=== DEVICE MASTER / ${service.name.toUpperCase()} ===`,
      'ESCOPO: perfil sintético local; não usar para cadastro ou autenticação.',
      `Destino oficial: ${service.url}`,
      `Dispositivo: ${device.deviceName}`,
      `Fingerprint local: ${device.fingerprint}`,
      `IMEI sintético: ${device.imei}`,
      `User-Agent de referência: ${device.userAgent}`,
      `Persona de teste: ${personalData.fullName} / ${personalData.email}`,
      `Diagnóstico: ${diagnostics ? 'gerado' : 'não gerado'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      toast.success('Resumo local copiado');
    } catch {
      toast.error('Não foi possível acessar a área de transferência');
    }
  };

  const handleOpenOfficialSite = () => {
    const opened = window.open(service.url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      toast.error('Pop-up bloqueado. Use o link oficial abaixo para abrir o destino.');
      return;
    }
    toast.success(`${service.name} aberto em nova aba`, {
      description: 'A autenticação e as políticas do serviço continuam sob controle do site oficial.',
    });
  };

  const Icon = service.icon;

  return (
    <div className="space-y-6">
      <ModuleGuide guide={guide} accentClass={service.accentClass} />

      <section className="rounded-2xl border border-white/10 bg-[#08090f]/90 p-6 shadow-2xl md:p-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/50">
              <Icon className={`h-6 w-6 ${service.color}`} />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <span>{modeLabel}</span>
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-amber-200">LOCAL ONLY</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{service.name}</h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">{service.description}</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline" className="border-white/15 bg-black/30 text-slate-200 hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao menu
          </Button>
        </div>

        <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-950/20 p-4 text-xs leading-5 text-amber-100/80">
          <strong className="text-amber-200">Limite de segurança:</strong> esta tela prepara informações sintéticas e diagnósticos no navegador local. Ela não injeta scripts em terceiros, não altera cookies ou tokens, não contorna CAPTCHA/anti-bot e não promete aceitação pelo serviço externo.
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <Checkbox checked={privacyChecklist} onCheckedChange={(value) => setPrivacyChecklist(Boolean(value))} />
            <span><strong className="block text-xs text-white">Checklist de privacidade</strong><small className="mt-1 block text-[10px] leading-4 text-slate-500">Gera o pacote de referência local; não é executado no destino.</small></span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <Checkbox checked={nativeAppPreview} onCheckedChange={(value) => setNativeAppPreview(Boolean(value))} />
            <span><strong className="block text-xs text-white">Prévia de app nativo</strong><small className="mt-1 block text-[10px] leading-4 text-slate-500">Mantém a simulação restrita ao diagnóstico local.</small></span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <Checkbox checked={behaviorPlan} onCheckedChange={(value) => setBehaviorPlan(Boolean(value))} />
            <span><strong className="block text-xs text-white">Plano de interação</strong><small className="mt-1 block text-[10px] leading-4 text-slate-500">Exibe métricas locais sem automatizar o site externo.</small></span>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleGenerateLocalProfile} disabled={isGenerating} className={`font-bold ${service.color.replace('text-', 'bg-')} text-slate-950 hover:opacity-90`}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Gerar perfil local
          </Button>
          <Button onClick={handleOpenOfficialSite} variant="outline" className="border-white/20 bg-black/30 text-white hover:bg-white/10">
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir site oficial
          </Button>
        </div>

        {device && personalData ? (
          <div className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200"><Cpu className="h-4 w-4" /> Hardware sintético</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-white">Dispositivo:</strong> {device.deviceName}</p>
                  <p><strong className="text-white">Modelo:</strong> {device.manufacturer} {device.model}</p>
                  <p><strong className="text-white">Resolução:</strong> {device.resolution}</p>
                  <p><strong className="text-white">Fingerprint:</strong> <span className="font-mono text-cyan-200">{device.fingerprint}</span></p>
                  <p><strong className="text-white">Identificador local:</strong> <span className="font-mono">{device.androidId}</span></p>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200"><UserRound className="h-4 w-4" /> Persona sintética</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-white">Nome de teste:</strong> {personalData.fullName}</p>
                  <p><strong className="text-white">Email sintético:</strong> <span className="font-mono text-emerald-200">{personalData.email}</span></p>
                  <p><strong className="text-white">Telefone:</strong> {personalData.phone}</p>
                  <p><strong className="text-white">Localização:</strong> {personalData.city}, {personalData.state}</p>
                  <p><strong className="text-white">Uso permitido:</strong> testes locais e documentação</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-950/15 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200">Privacidade</p><p className="mt-2 text-lg font-bold text-white">{diagnostics?.antiDetectionBundleSize ?? 0} bytes</p><p className="text-[10px] text-slate-500">pacote local de referência</p></div>
              <div className="rounded-xl border border-violet-300/20 bg-violet-950/15 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-violet-200">App preview</p><p className="mt-2 text-lg font-bold text-white">{diagnostics?.nativeAppBundleSize ?? 0} bytes</p><p className="text-[10px] text-slate-500">não enviado ao destino</p></div>
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-950/15 p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-emerald-200">Comportamento</p><p className="mt-2 text-lg font-bold text-white">{diagnostics?.behaviorBundleSize ?? 0} bytes</p><p className="text-[10px] text-slate-500">plano local de demonstração</p></div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-[11px] text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Perfil salvo apenas no histórico local do projeto.</div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCopySummary} variant="outline" className="border-white/15 bg-black/30 text-slate-200 hover:bg-white/10"><Clipboard className="mr-2 h-4 w-4" /> Copiar resumo</Button>
                <Button onClick={handleOpenOfficialSite} className="bg-white text-slate-950 hover:bg-slate-200"><ExternalLink className="mr-2 h-4 w-4" /> Continuar no site oficial</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-black/20 px-6 py-12 text-center">
            <Fingerprint className="mx-auto mb-3 h-10 w-10 text-slate-600" />
            <h3 className="text-sm font-bold text-white">Nenhum perfil local preparado</h3>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-500">Gere um perfil para revisar os campos técnicos, os indicadores de compatibilidade e o escopo do fluxo antes de abrir o destino oficial.</p>
            <Button onClick={handleGenerateLocalProfile} disabled={isGenerating} className="mt-5 bg-white text-slate-950 hover:bg-slate-200"><KeyRound className="mr-2 h-4 w-4" /> Preparar agora</Button>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] uppercase tracking-[0.14em] text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Acesso externo separado do ambiente de diagnóstico local</div>
      </section>
    </div>
  );
}
