# Direção visual e arquitetura dos guias

## Três direções consideradas

### Theme Name: Console Neon Editorial
Very Brief Intro: Uma evolução controlada do visual técnico existente, com painéis escuros, acentos de cor por plataforma e documentação apresentada como uma camada editorial clara.
Probability: 0.07

### Theme Name: Atlas Operacional
Very Brief Intro: Uma interface de central de operações com navegação lateral, hierarquia de informação e cartões compactos para orientar o usuário sem competir com os fluxos principais.
Probability: 0.04

### Theme Name: Field Manual
Very Brief Intro: Um manual técnico digital, com blocos numerados, notas de contexto e linguagem de documentação que transforma cada menu em uma ferramenta autoexplicativa.
Probability: 0.02

## Abordagem escolhida: Field Manual

### Design Movement
Documentação técnica editorial combinada com dashboard operacional, inspirada em manuais de campo, terminais de engenharia e interfaces de inspeção.

### Core Principles
1. Cada menu deve explicar sua função antes de apresentar seus controles.
2. Cada campo deve indicar o que representa e por que pode não existir em outros módulos.
3. A documentação deve ser acessível em dois níveis: tooltip curto e guia completo sob demanda.
4. A interface existente deve ser preservada; a documentação entra como camada contextual, não como substituição do fluxo.

### Color Philosophy
O fundo escuro permanece para preservar o caráter de console, mas a cor deixa de ser apenas decorativa: cada plataforma mantém seu acento para criar orientação espacial. Verde-azulado será a cor própria do sistema para guias, notas e estados explicativos, distinguindo documentação de ações operacionais.

### Layout Paradigm
Cada menu terá um cabeçalho de missão com descrição curta, um botão Guia do menu e uma faixa de escopo explicando quais famílias de dados são esperadas. Os guias utilizarão painel lateral ou diálogo com seções numeradas: finalidade, campos, fluxo recomendado, limites e interpretação de ausência de dados.

### Signature Elements
1. Etiquetas `ESCOPO`, `CAMPOS` e `FLUXO` como micro-navegação editorial.
2. Ícone de informação junto a cada campo sensível ou específico.
3. Painel `Como interpretar este menu` reutilizável em todos os módulos.

### Interaction Philosophy
Tooltips aparecem rapidamente ao foco ou hover e nunca ocultam informação essencial. O botão Guia abre uma documentação completa sem tirar o usuário do menu. O fechamento é sempre claro, com suporte a teclado e foco visível.

### Animation
Tooltips usam entrada curta de opacidade e deslocamento mínimo. O guia entra como painel com `opacity` e `transform`, em menos de 250 ms, respeitando `prefers-reduced-motion`. Não haverá animações que alterem layout de forma brusca.

### Typography System
Títulos usam uma fonte monoespaçada de display para manter a linguagem de console; corpo e documentação usam uma sans-serif legível. A hierarquia será: título do módulo, missão, seção numerada, rótulo de campo, descrição e nota auxiliar.

### Brand Essence
Um painel multi-plataforma que torna cada módulo autoexplicativo, para quem precisa entender o escopo e o significado de cada campo antes de operar. Personalidade: técnico, transparente, orientador.

### Brand Voice
Headlines são diretas e operacionais. CTAs descrevem a consequência da ação. Microcopy explica limites sem prometer eficácia externa.

Exemplo 1: “Leia o escopo antes de gerar um perfil.”

Exemplo 2: “Este menu prioriza dados de sessão; por isso não exibe um inventário completo de hardware.”

### Wordmark & Logo
O wordmark será mantido em caixa alta monoespaçada, acompanhado de um símbolo geométrico de oito pontos conectados, representando os oito módulos e a ideia de navegação orientada.

### Signature Brand Color
`#35D0BA` — verde-água de documentação, usado exclusivamente para guias, notas e esclarecimentos de escopo.

## Arquitetura funcional da documentação

Cada menu receberá um objeto de configuração com `title`, `mission`, `scope`, `fields`, `recommendedFlow`, `whyDifferent` e `limitations`. Um componente compartilhado renderizará o cabeçalho contextual, os tooltips de campo e o guia completo. A documentação será declarativa, evitando duplicação e mantendo consistência entre os oito menus.

A documentação não afirmará que alterações de identidade, anti-detecção ou injeção garantem sucesso em plataformas externas. Ela distinguirá claramente entre dados exibidos pela interface, comportamento implementado no código e eficácia que depende de sistemas de terceiros.
