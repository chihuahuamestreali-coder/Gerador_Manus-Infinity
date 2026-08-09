import fs from 'node:fs';
import path from 'node:path';

const root = '/home/ubuntu/alidevman-pro-v3/client/src/pages';
const modules = {
  AliExpressManager: ['aliexpress', 'text-red-300'],
  FacebookManager: ['facebook', 'text-blue-300'],
  InstagramManager: ['instagram', 'text-pink-300'],
  EmailManager: ['email', 'text-cyan-300'],
  ManusManager: ['manus', 'text-orange-300'],
  TikTokManager: ['tiktok', 'text-sky-300'],
  ClaudeManager: ['claude', 'text-purple-300'],
  GmailManager: ['gmail', 'text-red-300'],
};

for (const [name, [key, accent]] of Object.entries(modules)) {
  const file = path.join(root, `${name}.tsx`);
  let source = fs.readFileSync(file, 'utf8');
  if (!source.includes("@/components/ModuleGuide")) {
    source = `import ModuleGuide from '@/components/ModuleGuide';\nimport { MODULE_GUIDES } from '@/lib/moduleGuides';\n${source}`;
  }
  if (!source.includes(`MODULE_GUIDES['${key}']`)) {
    const returnIndex = source.indexOf('return (');
    const divIndex = source.indexOf('<div className=', returnIndex);
    if (returnIndex < 0 || divIndex < 0) throw new Error(`Ponto de montagem não encontrado em ${file}`);
    const lineEnd = source.indexOf('\n', divIndex);
    const guide = `\n        <ModuleGuide guide={MODULE_GUIDES['${key}']} accentClass="${accent}" />`;
    source = source.slice(0, lineEnd) + guide + source.slice(lineEnd);
  }
  fs.writeFileSync(file, source);
}
