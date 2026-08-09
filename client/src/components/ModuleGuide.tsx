// Field Manual: camada contextual compartilhada; preserva o fluxo existente e adiciona orientação sob demanda.
import { BookOpen, Info, Layers3, Route, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { GuideField, ModuleGuide as ModuleGuideData } from '@/lib/moduleGuides';

export function FieldTooltip({ field }: { field: GuideField }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={`Explicação: ${field.label}`} className="ml-1 inline-flex align-middle text-teal-300/80 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 rounded-full">
          <Info size={13} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-slate-950 text-slate-100 border-teal-400/40">
        <span className="font-semibold text-teal-200">{field.label}:</span> {field.meaning}
      </TooltipContent>
    </Tooltip>
  );
}

export function GuideFieldLabel({ field }: { field: GuideField }) {
  return <span className="inline-flex items-center">{field.label}<FieldTooltip field={field} /></span>;
}

export default function ModuleGuide({ guide, accentClass = 'text-teal-300', compact = false }: { guide: ModuleGuideData; accentClass?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section className="mb-6 rounded-xl border border-teal-300/25 bg-teal-950/15 p-4 shadow-[0_16px_40px_rgba(20,184,166,0.08)]" aria-labelledby={`${guide.key}-mission`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500"><img src="/manus-storage/device-master-mark_0b9ede57.png" alt="" aria-hidden="true" className="h-5 w-5 rounded border border-teal-300/25 bg-slate-950/60 p-1" /> <span>Device Master / Inspection Note</span></div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-teal-300/80">
              <span className="rounded border border-teal-300/30 px-2 py-1">ESCOPO</span>
              <span className="text-slate-500">{guide.family}</span>
            </div>
            <h2 id={`${guide.key}-mission`} className={`text-lg font-bold ${accentClass}`}><span className="mr-2 text-xs font-bold tracking-[0.18em] text-slate-500">01</span>O que este menu faz</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{guide.mission}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400"><span className="font-semibold text-teal-200">Por que os campos variam:</span> {guide.scope}</p>
          </div>
          <Button type="button" onClick={() => setOpen(true)} variant="outline" className="shrink-0 border-teal-300/40 bg-teal-950/20 text-teal-200 hover:bg-teal-400/10 hover:text-teal-100">
            <BookOpen size={16} className="mr-2" /> Guia do menu
          </Button>
        </div>
        {!compact && <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-slate-500"><span className="inline-flex items-center gap-1"><Layers3 size={13} className="text-teal-300" /> Campos explicados</span><span className="inline-flex items-center gap-1"><Route size={13} className="text-teal-300" /> Fluxo recomendado no guia</span><span className="inline-flex items-center gap-1"><ShieldAlert size={13} className="text-teal-300" /> Limites documentados</span></div>}
      </section>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/75 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby={`${guide.key}-guide-title`}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-teal-300/35 bg-slate-950 p-6 text-slate-100 shadow-2xl shadow-teal-950/40">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-teal-300">FIELD MANUAL / {guide.family}</p><h2 id={`${guide.key}-guide-title`} className="mt-2 text-2xl font-bold text-white">{guide.title}</h2><p className="mt-2 text-sm text-slate-400">{guide.mission}</p></div>
              <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="icon" aria-label="Fechar guia" className="text-slate-400 hover:text-white"><X size={20} /></Button>
            </div>
            <div className="grid gap-6 py-6 md:grid-cols-2">
              <div><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200"><span className="mr-2 text-slate-500">02</span>Campos e significado</h3><div className="mt-3 space-y-3">{guide.fields.map((field) => <div key={field.label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3"><p className="text-sm font-semibold text-slate-100"><GuideFieldLabel field={field} /></p><p className="mt-1 text-xs leading-5 text-slate-400">{field.meaning}</p></div>)}</div></div>
              <div><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200"><span className="mr-2 text-slate-500">03</span>Melhor forma de usar</h3><ol className="mt-3 space-y-3">{guide.recommendedFlow.map((step, index) => <li key={step} className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-xs font-bold text-teal-200">{index + 1}</span><span>{step}</span></li>)}</ol><div className="mt-6 rounded-lg border border-teal-300/25 bg-teal-950/20 p-4"><h3 className="text-sm font-bold text-teal-200">Por que este menu não mostra tudo?</h3><p className="mt-2 text-xs leading-5 text-slate-300">{guide.whyDifferent}</p></div></div>
            </div>
            <div className="rounded-lg border border-amber-300/20 bg-amber-950/15 p-4"><p className="text-xs leading-5 text-amber-100/80"><span className="font-bold text-amber-200">Limite importante:</span> {guide.limitations}</p></div>
            <div className="mt-5 flex justify-end"><Button type="button" onClick={() => setOpen(false)} className="bg-teal-500 text-slate-950 hover:bg-teal-400">Entendi o escopo</Button></div>
          </div>
        </div>
      )}
    </>
  );
}
