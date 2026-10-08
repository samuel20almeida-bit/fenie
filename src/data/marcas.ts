// Portfólio de marcas representadas — a lista veio do site anterior, que traz
// as 7 marcas com logo oficial e sem texto descritivo. Por isso os cards
// secundários mostram só nome e logo: nada de categoria inventada.
// Conforme cada marca ganhar página própria (como a Olenka), preencher
// `href` e `resumo` a partir do material oficial da marca.
export interface Marca {
  slug: string;
  nome: string;
  logo: string;
  /** Página interna da marca, quando já existe. */
  href?: string;
  /** Só para a marca em destaque no grid. */
  destaque?: {
    eyebrow: string;
    imagem: string;
    imagemAlt: string;
    resumo: string;
  };
}

export const marcas: Marca[] = [
  {
    slug: "olenka",
    nome: "Olenka Cosméticos",
    logo: "/images/brand-logos/olenka-cosmeticos.webp",
    href: "/marcas/olenka",
    destaque: {
      eyebrow: "Tratamento · Transformação",
      imagem: "/images/marcas/olenka/royal-look.webp",
      imagemAlt: "Kit Royal Look, alisamento capilar Olenka",
      resumo:
        "Alisamento, cor e reconstrução em um portfólio profissional completo, vendido apenas por distribuidores credenciados.",
    },
  },
  { slug: "mup-color", nome: "Mup Color", logo: "/images/brand-logos/mup-color.webp" },
  { slug: "doha", nome: "DOHA", logo: "/images/brand-logos/doha.webp" },
  { slug: "glynett", nome: "Glynett", logo: "/images/brand-logos/glynett.webp" },
  { slug: "rigolim", nome: "Rigolim", logo: "/images/brand-logos/rigolim.webp" },
  { slug: "spa-do-fio", nome: "Spa do Fio", logo: "/images/brand-logos/spa-do-fio.webp" },
  {
    slug: "papel-para-mechas",
    nome: "Papel Para Mechas",
    logo: "/images/brand-logos/papel-para-mechas.webp",
  },
];

export const marcaDestaque = marcas.find((m) => m.destaque)!;
export const marcasSecundarias = marcas.filter((m) => !m.destaque);
