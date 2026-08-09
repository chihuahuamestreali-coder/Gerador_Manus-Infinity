# Visual validation notes

The local Vite app rendered the Home page at `http://localhost:3000/Gerador_Manus-Infinity/` after the development server was started on port 3000. The rendered page exposes the new GitHub and Discord anchors, the existing Dark banner, and the new Van Gogh banner labeled `Creative AI / 6 submenus independentes`. Existing cards remain visible and the page loaded without a runtime error after waiting for Vite/React hydration.

The Home banner opened `/van-gogh` successfully. The Van Gogh page renders exactly six cards: HackAIGC, Leonardo.Ai, Playground AI, HackAIGC Lab, Pika, and Runway. Clicking HackAIGC opened an independent workspace with its own guide, local-only badge, three diagnostic toggles, official-site button, and explicit safety boundary text.

The Dark route rendered `DARK MASTER HUB • 7 SERVIÇOS EXCLUSIVOS` with the existing five entries plus `Uncensored` and `Atomic Mail`. Both new cards were visible in the submenu bar and service grid, and the hub copy identifies them as local diagnostic workspaces with official-site access rather than security bypasses.

The Dark `Uncensored` card opened the shared local-only workspace with the Uncensored-specific guide. Switching to `Atomic Mail` updated the guide, title, description, and destination profile independently, confirming both requested Dark entries are wired to separate submenu states.

## Retomada — 2026-08-09

A Home local abriu em `/Gerador_Manus-Infinity/` após a restauração. O conteúdo renderizado confirma `10 MÓDULOS + 2 HUBS`, links externos para GitHub e Discord, os dez cards principais e os banners Dark e Van Gogh. O navegador mostrou a rota sem erro de carregamento; a primeira captura ficou branca durante a pintura inicial, mas a segunda visualização exibiu o layout cyberpunk completo.

A implementação foi restaurada do artefato da sessão anterior porque o `origin/main` atual continha apenas a base Dark de cinco serviços e não os arquivos não publicados exibidos no print.

### Validação visual adicional

A rota `/van-gogh` abriu o hub com exatamente seis cards independentes: HackAIGC, Leonardo.Ai, Playground AI, HackAIGC Lab, Pika e Runway. O submenu HackAIGC abriu seu workspace próprio com selo `LOCAL ONLY`, três checkboxes ativados por padrão, botão de geração local, link oficial e texto explícito de que não há injeção de scripts, alteração de cookies/tokens, contorno de CAPTCHA/anti-bot ou promessa de aceitação externa.

### Validação visual do Dark

A rota `/dark` mostrou o hub com sete serviços: os cinco legados, Uncensored e Atomic Mail. O card Uncensored abriu um workspace independente com guia específico, selo `LOCAL ONLY`, checkboxes ativados e URL oficial separada. A tela reiterou que os diagnósticos não são enviados ao destino e que não manipulam autenticação, cookies, tokens, CAPTCHA ou controles externos.

### Validação visual do Atomic Mail

O botão Atomic Mail alternou para um guia próprio com o escopo `Dark / Email privado` e a descrição de limites para tokens, cookies e autenticação. A geração local produziu hardware, persona e métricas no navegador; os indicadores exibiram 4.774 bytes de referência de privacidade, 0 bytes de prévia nativa e 1.971 bytes de plano de comportamento, além de `Uso permitido: testes locais e documentação`. A tela manteve o botão separado para continuar no site oficial.

Fonte visual externa: https://ibb.co/0jT5zzrD (print da sessão anterior). Validação local: http://localhost:3000/Gerador_Manus-Infinity/dark.
