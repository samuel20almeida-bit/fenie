# Fenié Pro — site institucional

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
- Tipografia: títulos (h1/h2/h3) e corpo usam `font-body` (Archivo —
  títulos em 700 bold, alinhados à identidade sans da logo); `font-display`
  (Bodoni Moda) fica reservada só para citações entre aspas (`blockquote`);
  `font-mono` (JetBrains Mono) em etiquetas/números — ver classe
  utilitária `.eyebrow`.
- Movimento: `--ease-editorial` é a curva única do briefing
  (`cubic-bezier(.23,1,.32,1)`); a classe `.reveal` implementa a entrada
  por scroll (550ms, dispara uma vez só) via `IntersectionObserver` em
  `src/layouts/Layout.astro`.
- Logo: `public/images/logo/fenie-pro-logo.webp` é a logo oficial
  (wordmark + onda), usada em `Header.astro` e `Footer.astro`. Veio como
  JPEG com fundo sólido; `fenie-pro-mark.webp` é só a onda, recortada do
  mesmo arquivo e usada como base do favicon (`public/favicon.png`). Fundo
  removido via `convert -fuzz 12% -transparent "srgb(8,15,41)" -trim`
  (ImageMagick) — a cor do fundo original já era quase idêntica ao
  `--color-midnight` do tema, então o recorte cola sem emenda visível em
  qualquer seção midnight do site. Se a marca mandar um arquivo vetorial
  (SVG/AI) no futuro, ele substitui o WebP sem precisar desse processo.

## WhatsApp contextual

Todo CTA usa `whatsappLink(mensagem)` de `src/lib/whatsapp.ts`, que já
abre a conversa com o contexto certo (marca, curso, região) em vez de um
número solto — é a regra "contexto no clique" do briefing. O número já é
o real (+55 41 9840-2800); `PUBLIC_WHATSAPP_NUMBER` (ver `.env.example`)
só precisa ser definida se algum ambiente exigir um número diferente.

## Estrutura de rotas (as quatro portas)

```
/                 Home
/a-fenie          Institucional
/marcas           Portfólio de marcas
/marcas/olenka    Página de marca (modelo — replicar por marca)
/solucoes         Apoio ao negócio
/academy          Fenié Academy / agenda de cursos
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
- **Time Fenié**: `src/components/Consultants.astro` já tem nome, cargo
  e foto reais de Osvaldir Niejelski (CEO) e Ricardo Souza (Diretor de
  Marketing e Comercial). Fotos em `public/images/team/`, recortadas em
  quadrado a partir do material enviado pela empresa e exportadas em
  WebP (~5KB cada).
- **Academy**: `src/components/AcademyTeaser.astro` tem um curso de
  exemplo; a agenda real e a página de cada educador precisam de dono
  definido antes do lançamento (regra do briefing, não só boa prática).
- **Marcas**: a Olenka já tem catálogo completo e real — 21 linhas de
  produto, packshots oficiais e a foto do embaixador técnico, extraídos
  da apresentação oficial da marca (`src/data/olenka.ts`,
  `public/images/marcas/olenka/`). É o modelo para as próximas marcas:
  um arquivo de dados + `<ProductLineCard>` por marca quando o catálogo
  dela chegar.

## SEO

`src/layouts/Layout.astro` gera canonical, Open Graph e Twitter Card por
página (título, descrição e `og:image` — usa `public/images/og-default.jpg`
por padrão, ou passe `ogImage` como prop numa página específica). Sitemap
automático via `@astrojs/sitemap` (`/sitemap-index.xml`) e `public/robots.txt`
apontando pra ele. Existe uma página 404 no mesmo sistema visual do site
(`src/pages/404.astro`).

## Catálogo Olenka

`src/data/olenka.ts` tem as 21 linhas de produto agrupadas em 7
categorias (Alisamento & liso, Coloração & loiros, Reconstrução &
nutrição, Finalizadores, Home care, Couro cabeludo & anti-queda, Men's
Care), renderizadas em `src/pages/marcas/olenka.astro` via
`<ProductLineCard>`. As imagens em `public/images/marcas/olenka/` são
packshots isolados (fundo transparente) extraídos da apresentação
oficial da marca e comprimidos em WebP — a pasta inteira pesa ~680KB.
Se a apresentação for atualizada, repita o processo: `pdfimages -png`
para extrair, `convert ... -alpha off -compose CopyOpacity -composite`
para juntar imagem+máscara, `convert ... -resize 700x700` para exportar
em WebP.
