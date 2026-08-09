import { ComponentType } from 'react';
import { Bot, Clapperboard, Github, ImageIcon, Mail, MessageCircle, Palette, Sparkles, Video } from 'lucide-react';

export type ExternalServiceKey =
  | 'uncensored'
  | 'atomicmail'
  | 'github'
  | 'discord'
  | 'hackaigc'
  | 'leonardo'
  | 'playground'
  | 'hackaigc-lab'
  | 'pika'
  | 'runway';

export type ExternalServiceDefinition = {
  key: ExternalServiceKey;
  name: string;
  url: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  accentClass: string;
  category: string;
};

export const EXTERNAL_SERVICES: Record<ExternalServiceKey, ExternalServiceDefinition> = {
  uncensored: {
    key: 'uncensored',
    name: 'Uncensored',
    url: 'https://uncensored.com/',
    description: 'Portal de inteligência artificial sem censura, com motor anti-detecção 16+, spoofing de WebRTC/Canvas e simulação de app nativo.',
    icon: Bot,
    color: 'text-cyan-300',
    accentClass: 'text-cyan-300',
    category: 'Dark / IA',
  },
  atomicmail: {
    key: 'atomicmail',
    name: 'Atomic Mail',
    url: 'https://atomicmail.io/',
    description: 'Serviço de email privado e anônimo, blindado com gerador de persona, fingerprint de hardware e mascaramento de headers.',
    icon: Mail,
    color: 'text-emerald-300',
    accentClass: 'text-emerald-300',
    category: 'Dark / Email privado',
  },
  github: {
    key: 'github',
    name: 'GitHub Manager',
    url: 'https://github.com/signup',
    description: 'Gerador de contas e bypass anti-bot para criação de contas GitHub sem bloqueios de fingerprint, com injeção 16+ completa.',
    icon: Github,
    color: 'text-slate-100',
    accentClass: 'text-slate-100',
    category: 'Dev & Auth / Cadastro',
  },
  discord: {
    key: 'discord',
    name: 'Discord Manager',
    url: 'https://discord.com/register',
    description: 'Blindagem e spoofing avançado para criação de contas Discord seguras, com injeção de hardware móvel/desktop e comportamento humano.',
    icon: MessageCircle,
    color: 'text-indigo-400',
    accentClass: 'text-indigo-400',
    category: 'Community & Auth / Cadastro',
  },
  hackaigc: {
    key: 'hackaigc',
    name: 'HackAIGC',
    url: 'https://www.hackaigc.com/pt',
    description: 'Hub de criação com IA blindado com motor anti-detecção 16+, spoofing completo de navegador e injeção de identidade.',
    icon: Sparkles,
    color: 'text-fuchsia-300',
    accentClass: 'text-fuchsia-300',
    category: 'Van Gogh / Criação',
  },
  leonardo: {
    key: 'leonardo',
    name: 'Leonardo.Ai',
    url: 'https://leonardo.ai',
    description: 'Plataforma de arte generativa com spoofing de hardware, Device ID sintético e blindagem de sessão contra detecção anti-bot.',
    icon: Palette,
    color: 'text-violet-300',
    accentClass: 'text-violet-300',
    category: 'Van Gogh / Imagem e vídeo',
  },
  playground: {
    key: 'playground',
    name: 'Playground AI',
    url: 'https://playgroundai.com',
    description: 'Design e imagem generativa com injeção de fingerprint 16+, simulação de app nativo e isolamento total de cookies.',
    icon: ImageIcon,
    color: 'text-amber-300',
    accentClass: 'text-amber-300',
    category: 'Van Gogh / Design',
  },
  'hackaigc-lab': {
    key: 'hackaigc-lab',
    name: 'HackAIGC Lab',
    url: 'https://www.hackaigc.com/pt',
    description: 'Laboratório de criação com IA com túneis proxy, spoofing de WebRTC e injeção de comportamento de digitação humana.',
    icon: Clapperboard,
    color: 'text-pink-300',
    accentClass: 'text-pink-300',
    category: 'Van Gogh / Laboratório',
  },
  pika: {
    key: 'pika',
    name: 'Pika',
    url: 'https://pika.art',
    description: 'Criação de vídeo com injeção de hardware móvel/desktop, MAC address sintético e sanitização completa de headers HTTP.',
    icon: Video,
    color: 'text-sky-300',
    accentClass: 'text-sky-300',
    category: 'Van Gogh / Vídeo',
  },
  runway: {
    key: 'runway',
    name: 'Runway',
    url: 'https://runwayml.com',
    description: 'Ferramentas criativas de vídeo com IA protegidas por motor anti-detecção 16+, WebRTC guard e persona sintética integrada.',
    icon: Clapperboard,
    color: 'text-lime-300',
    accentClass: 'text-lime-300',
    category: 'Van Gogh / Vídeo e IA',
  },
};

export const VAN_GOGH_SERVICE_KEYS = [
  'hackaigc',
  'leonardo',
  'playground',
  'hackaigc-lab',
  'pika',
  'runway',
] as const;

export type VanGoghServiceKey = (typeof VAN_GOGH_SERVICE_KEYS)[number];
