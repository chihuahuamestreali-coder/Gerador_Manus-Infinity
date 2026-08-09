# Device Master — documentação contextual e tooltips

## Escopo da entrega

A versão atual preserva os geradores, páginas, rotas e utilitários migrados do projeto original. A principal extensão é uma camada de documentação contextual para os oito menus: AliExpress, Facebook, Instagram, Email, Manus, TikTok, Claude e Gmail.

## O que foi adicionado

| Área | Implementação |
|---|---|
| Guia visível | Cada menu recebeu um painel `O que este menu faz`, com escopo e motivo da variação de campos. |
| Botão de guia | O botão `Guia do menu` abre um painel com finalidade, campos, melhor fluxo de uso, diferença em relação aos outros módulos e limites. |
| Tooltips | Cada campo documentado possui um ícone de informação acessível por mouse e teclado. |
| Identidade visual | A camada Field Manual usa a cor documental `#35D0BA`, numerais de seção, rótulos `ESCOPO`, `CAMPOS`, `FLUXO` e o símbolo Device Master. |
| Home | A página inicial foi atualizada para explicar que cada módulo tem escopo próprio e que os guias devem ser consultados antes da operação. |

## Arquivos principais adicionados

- `client/src/lib/moduleGuides.ts`: catálogo editorial dos oito módulos.
- `client/src/components/ModuleGuide.tsx`: componente compartilhado de guia e tooltip.
- `scripts/add-guides.mjs`: script determinístico usado para inserir a camada nos gerenciadores.
- `style_review_applied.md`: registro das decisões de coerência visual.

## Execução local

```bash
pnpm install
pnpm dev
```

Para validação de produção:

```bash
pnpm check
pnpm build
```

A documentação explica o comportamento da aplicação local. Ela não promete aprovação, autenticação, permanência de sessão ou aceitação por serviços externos.
