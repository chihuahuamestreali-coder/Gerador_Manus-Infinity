# Implementação dos menus Dark e Van Gogh

## Resumo

Foi ampliado o projeto **Device Master** com dois destinos no menu Dark, um hub visual independente chamado **Van Gogh**, seis submenus criativos independentes, links principais para GitHub e Discord, e um workspace compartilhado para preparação diagnóstica local.

| Área | Implementação |
|---|---|
| Dark | Inclusão de Uncensored e Atomic Mail, com guias específicos e workspace local compartilhado. |
| Van Gogh | Novo hub em `/van-gogh` com HackAIGC, Leonardo.Ai, Playground AI, HackAIGC Lab, Pika e Runway. |
| Menu principal | Links externos para GitHub e Discord; banner Van Gogh logo abaixo do banner Dark. |
| Recursos reaproveitados | Perfil universal, dados sintéticos, histórico local, simulador de app nativo, plano de comportamento e pacote de referência de privacidade. |
| Integração externa | Abertura dos endereços oficiais em nova aba, sem enviar os dados gerados pelo workspace. |

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `client/src/lib/externalServiceCatalog.ts` | Catálogo tipado dos dois destinos Dark e dos seis destinos Van Gogh. |
| `client/src/components/ExternalServiceWorkspace.tsx` | Workspace reutilizável de diagnóstico local, com toggles, geração sintética, histórico e acesso oficial. |
| `client/src/components/VanGoghBanner.tsx` | Banner visual do novo menu mestre. |
| `client/src/pages/VanGoghHub.tsx` | Hub com seis cards independentes e navegação interna entre os submenus. |
| `client/src/pages/DarkSpecial.tsx` | Menu Dark ampliado de cinco para sete serviços. |
| `client/src/pages/Home.tsx` | Links GitHub/Discord, contagem atualizada e banner Van Gogh. |
| `client/src/App.tsx` | Rota `/van-gogh`. |
| `client/src/lib/moduleGuides.ts` | Guias e limitações específicas de cada novo destino. |

## Fluxo de uso

O usuário pode abrir o banner **Van Gogh** no menu principal para acessar seis cards independentes. Cada card exibe a descrição do destino, abre um workspace próprio e preserva a URL oficial solicitada. No Dark, os cards **Uncensored** e **Atomic Mail** aparecem junto aos cinco serviços existentes e alternam para o mesmo componente reutilizável com configuração específica por serviço.

O workspace pode gerar um perfil sintético local com hardware, fingerprint, persona de teste e métricas dos pacotes de referência. O estado é salvo apenas no navegador e no histórico local do projeto. Também é possível copiar um resumo técnico ou abrir o site oficial em nova aba.

## Limite de segurança

> Os novos menus não implementam bypass de CAPTCHA/anti-bot, spoofing de tokens, manipulação de cookies, interceptação de sessões, injeção de scripts em terceiros ou automação de cadastros. Os perfis e diagnósticos são locais e informativos; autenticação, conteúdo, limites e políticas permanecem sob controle de cada site oficial.

Essa separação evita prometer que um perfil local será aceito por um serviço externo e mantém o projeto compatível com usos autorizados de diagnóstico, documentação e navegação.

## Verificações realizadas

| Verificação | Resultado |
|---|---|
| `pnpm check` | Aprovado, sem erros TypeScript. |
| `pnpm build` | Aprovado; bundle cliente e servidor gerados. |
| `git diff --check` | Aprovado, sem erros de whitespace. |
| Home local | Renderizou contagem atualizada, GitHub, Discord, Dark e Van Gogh. |
| `/van-gogh` | Renderizou exatamente seis submenus independentes. |
| HackAIGC | Workspace abriu e gerou diagnóstico local com métricas. |
| `/dark` | Renderizou sete serviços, incluindo Uncensored e Atomic Mail. |
| Uncensored | Guia específico e workspace local verificados. |
| Atomic Mail | Guia específico e estado independente verificados. |

O build ainda apresenta avisos preexistentes sobre variáveis opcionais de analytics e tamanho de chunk; eles não impedem a compilação e não foram introduzidos pela implementação dos menus.
