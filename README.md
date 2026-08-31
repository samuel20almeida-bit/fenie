# Feniê Pro — site institucional

## Stack

**Astro + Tailwind v4.** Cada página é HTML/CSS estático por padrão —
zero JavaScript de framework. Isso importa porque o briefing estratégico
da marca define "peso antes de beleza" como regra: nenhuma página deve
pesar mais do que o 4G do salão aguenta. Interações que precisarem de
JavaScript de verdade (a cena sticky de uma futura Experience Page, por
exemplo) entram como componentes isolados, carregados só onde são
usados — não no site inteiro.

```
npm install
npm run dev       # http://localhost:4321
npm run build      # gera dist/
```

## Sistema de marca

Todos os tokens de cor, tipografia, espaçamento e movimento vêm do
briefing estratégico e estão centralizados em `src/styles/global.css`
(bloco `@theme` + variáveis em `:root`). Não redefinir cor ou fonte
direto num componente — sempre pela variável/utility já existente:

- Cores: `bg-midnight`, `bg-midnight-alt`, `bg-midnight-card`, `bg-gold`,
  `text-platina`, `text-bone` — os quatro degraus de elevação do
  briefing (Midnight → seção alternada → card → hover).
- Tipografia: `font-display` (Bodoni Moda, manchetes), `font-body`
  (Archivo, corpo — é o padrão do `<body>`), `font-mono` (JetBrains
  Mono, etiquetas/números — ver classe utilitária `.eyebrow`).
- Movimento: `--ease-editorial` é a curva única do briefing
  (`cubic-bezier(.23,1,.32,1)`); a classe `.reveal` implementa a entrada
  por scroll (550ms, dispara uma vez só) via `IntersectionObserver` em
  `src/layouts/Layout.astro`.

## WhatsApp contextual

Todo CTA usa `whatsappLink(mensagem)` de `src/lib/whatsapp.ts`, que já
abre a conversa com o contexto certo (marca, curso, região) em vez de um
número solto — é a regra "contexto no clique" do briefing. O número real
vem de `PUBLIC_WHATSAPP_NUMBER` (ver `.env.example`); sem isso, cai num
placeholder óbvio de trocar antes de publicar.

## Estrutura de rotas (as quatro portas)

```
/                 Home
/a-fenie          Institucional
/marcas           Portfólio de marcas
/marcas/olenka    Página de marca (modelo — replicar por marca)
/solucoes         Apoio ao negócio
/academy          Feniê Academy / agenda de cursos
/contato          Contato + cadastro profissional
```

Todas as páginas do menu têm conteúdo real agora. `/contato` inclui um
formulário de cadastro profissional (`ProfessionalSignupForm.astro`) que
monta a mensagem de WhatsApp a partir dos campos preenchidos — sem
backend, sem dado armazenado no site — e um FAQ (`Faq.astro`, accordion
nativo em `<details>`, sem JS). `/solucoes` reaproveita o conteúdo real
já publicado no site atual (`SolutionsList.astro`, `ProcessSteps.astro`).

## O que ainda depende de conteúdo real, não de código

Estes pontos são bloqueio de conteúdo, não de desenvolvimento — o
componente já existe, só falta o material real entrar:

- **Fotografia**: todo lugar com `<PlaceholderMedia>` está marcado e
  pronto para virar um `<img>` assim que o acervo fechar (briefing
  cap. 09 — nunca IA, sempre material oficial).
- **Consultores**: nomes/fotos em `src/components/Consultants.astro`
  estão como `[Nome do consultor]`.
- **Academy**: `src/components/AcademyTeaser.astro` tem um curso de
  exemplo; a agenda real e a página de cada educador precisam de dono
  definido antes do lançamento (regra do briefing, não só boa prática).
- **Marcas**: só a Olenka está com página própria
  (`src/pages/marcas/olenka.astro`) — é o modelo para as próximas.
