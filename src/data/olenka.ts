// Catálogo Olenka Cosméticos — extraído da apresentação oficial da marca
// (apres_revista_olenka_170726.pdf). Fotos são packshots oficiais, isolados
// do material da marca (briefing cap. 09 — nunca IA, sempre material oficial).
export interface ProductLine {
  slug: string;
  nome: string;
  headline: string;
  descricao: string;
  beneficios: string[];
  rendimento?: string;
  imagem: string;
}

export interface Category {
  nome: string;
  linhas: ProductLine[];
}

export const categories: Category[] = [
  {
    nome: "Alisamento & liso",
    linhas: [
      {
        slug: "royal-look",
        nome: "Royal Look",
        headline: "O alisante usado e aprovado pelos melhores cabeleireiros do Brasil",
        descricao:
          "Alisamento capilar livre de formol e amônia, com Bio Lacase como principal ativo, 14 aminoácidos, silicones nobres, proteína da seda e 7 óleos essenciais.",
        beneficios: ["Alisamento eficaz", "Produto multifuncional", "Sem formol, sem fumaça e sem cheiro"],
        rendimento: "20 aplicações",
        imagem: "/images/marcas/olenka/royal-look.webp",
      },
      {
        slug: "royal-soft",
        nome: "Royal Soft",
        headline: "Selagem e redução de volume em um só produto",
        descricao:
          "Alisante capilar para quem busca reduzir o volume dos cabelos ou realizar uma selagem, com resultado leve e igualmente eficaz.",
        beneficios: ["Redução de volume", "Produto multifuncional", "Controle de frizz"],
        rendimento: "35 aplicações",
        imagem: "/images/marcas/olenka/royal-soft.webp",
      },
      {
        slug: "royal-blond",
        nome: "Royal Blond",
        headline: "Loiro perfeito, sem amarelar, enquanto você escova e prancha",
        descricao:
          "Leave-in matizador termoativado que neutraliza tons amarelados durante o processo de escova e prancha, com extratos de blueberry e óleo de cálamo.",
        beneficios: [
          "Finalização de alisamentos e químicas para loiros",
          "Realce da cor",
          "Ativo durante o calor da escova/prancha",
        ],
        rendimento: "40 aplicações",
        imagem: "/images/marcas/olenka/royal-blond.webp",
      },
      {
        slug: "royal-care",
        nome: "Royal Care",
        headline: "Cabelos lisos, hidratados e selados por mais tempo",
        descricao:
          "Kit shampoo e condicionador de manutenção do liso, com 14 aminoácidos, 7 óleos e o ativo exclusivo Bio Lacase, no Sistema Dual Mask.",
        beneficios: [
          "Maior durabilidade do liso ou alisado",
          "Controle e disciplina dos fios",
          "Sistema Dual Mask: com ou sem tempo de pausa",
        ],
        imagem: "/images/marcas/olenka/royal-care.webp",
      },
      {
        slug: "royal-finish",
        nome: "Royal Finish",
        headline: "A máscara coringa do cabeleireiro",
        descricao:
          "Máscara universal que neutraliza as ações químicas e restaura o pH natural do cabelo. Uso pré e pós-química.",
        beneficios: ["Neutralização química universal", "Preparação para químicas", "Neutraliza odores"],
        rendimento: "35 aplicações",
        imagem: "/images/marcas/olenka/royal-finish.webp",
      },
      {
        slug: "ph-acid",
        nome: "pH Acid",
        headline: "A máscara aliada dos cabelos quimicamente tratados",
        descricao:
          "Máscara pós-química que atua na acidificação e no equilíbrio do pH da fibra capilar, fechando as cutículas.",
        beneficios: ["Sela as cutículas", "Aumenta a durabilidade das químicas", "Mais brilho e saúde para o fio"],
        rendimento: "20 aplicações",
        imagem: "/images/marcas/olenka/ph-acid.webp",
      },
    ],
  },
  {
    nome: "Coloração & loiros",
    linhas: [
      {
        slug: "olenkolor",
        nome: "Olenkolor",
        headline: "Cores vibrantes, hidratação intensa e brilho incrível",
        descricao:
          "Linha de máscaras matizadoras e tonalizantes disponível em Loiros Platinados, Loiros Intensos, Loiros Prateados, Acobreados, Morenas Iluminadas e Loiros Dourados.",
        beneficios: ["Realça e corrige a cor", "Hidratação intensa", "Acabamento profissional radiante"],
        rendimento: "20 aplicações",
        imagem: "/images/marcas/olenka/olenkolor.webp",
      },
      {
        slug: "blond-plex",
        nome: "Blond Plex",
        headline: "Aumente a proteção do cabelo durante as descolorações e colorações",
        descricao:
          "Protetor usado em sinergia com o pó descolorante, reduzindo os danos do processo em até 70%. O primeiro do mercado nacional.",
        beneficios: ["Proteção em até 70%", "O primeiro do mercado nacional", "Fios descoloridos e coloridos mais saudáveis"],
        rendimento: "25 aplicações",
        imagem: "/images/marcas/olenka/blond-plex.webp",
      },
      {
        slug: "blond-tech",
        nome: "Blond Tech",
        headline: "O sistema de descoloração desenvolvido por quem mais entende de loiros",
        descricao:
          "Pó descolorante enriquecido com nano colágeno e queratina, com OX em 5 volumes (10, 20, 30, 40 e 35), formulado para minimizar danos durante a descoloração.",
        beneficios: ["Abertura de até 9 tons", "Fragrância suave", "Creme ativador estabilizado"],
        imagem: "/images/marcas/olenka/blond-tech.webp",
      },
    ],
  },
  {
    nome: "Reconstrução & nutrição",
    linhas: [
      {
        slug: "bio-reconstrutor",
        nome: "Bio Reconstrutor",
        headline: "Recuperação profunda e imediata contra cabelos quebradiços",
        descricao:
          "Gloss de reestruturação e spray de regeneração enriquecidos com 21 aminoácidos, 7 óleos e Queratina Hidrolisada, para fios danificados por química ou calor.",
        beneficios: ["21 aminoácidos, 7 óleos e Queratina Hidrolisada", "Tecnologia exclusiva", "Uso pré-química"],
        rendimento: "45 aplicações",
        imagem: "/images/marcas/olenka/bio-reconstrutor.webp",
      },
      {
        slug: "bio-reconstrutor-self-care",
        nome: "Bio Reconstrutor Self Care",
        headline: "A recuperação e o tratamento que seu cabeleireiro confia, na sua casa",
        descricao:
          "Versão home care do Bio Reconstrutor: shampoo de tratamento e máscara de reconstrução para uso entre uma e duas vezes por semana.",
        beneficios: ["Continuidade do tratamento de salão em casa", "Para cabelos danificados", "Uso 1 a 2x por semana"],
        rendimento: "20 aplicações",
        imagem: "/images/marcas/olenka/bio-reconstrutor-self-care.webp",
      },
      {
        slug: "blend-proteinas",
        nome: "Blend de Proteínas",
        headline: "Nutrição intensiva recuperando a força e o brilho do seu cabelo",
        descricao:
          "Máscara com 12 proteínas isoladas (Nano Protein Technology) que repõe as proteínas essenciais dos fios, disponível em 600g e 220g.",
        beneficios: ["12 proteínas isoladas", "Nano Protein Technology", "Disponível em duas versões"],
        rendimento: "600g ≈ 60 aplicações · 220g ≈ 22 aplicações",
        imagem: "/images/marcas/olenka/blend-proteinas.webp",
      },
      {
        slug: "banho-colageno",
        nome: "Banho de Colágeno",
        headline: "Todos os benefícios do colágeno em um tratamento espetacular",
        descricao:
          "Tratamento com nanotecnologia que personaliza a recuperação capilar. Linha completa: shake profissional, leave-in e máscara home care.",
        beneficios: ["Nano Colágeno e blend exclusivo de aminoácidos", "Máscara inteligente", "Repara e aumenta a resistência do fio"],
        rendimento: "Profissional 40 aplicações · Home care 22 aplicações",
        imagem: "/images/marcas/olenka/banho-colageno.webp",
      },
      {
        slug: "hidra3",
        nome: "Hidra 3'",
        headline: "Hidratação e nutrição rápida e eficaz",
        descricao:
          "Kit shampoo, hidratação profunda e web mask com pró-vitamina B5, óleos de buriti, monoi e proteína da seda. Resultado em apenas 3 minutos.",
        beneficios: ["Hidratação profunda express (3 minutos)", "Ideal para todos os tipos de cabelo", "Cabelos leves e macios"],
        rendimento: "45 aplicações",
        imagem: "/images/marcas/olenka/hidra3.webp",
      },
      {
        slug: "especialidades",
        nome: "Linha Especialidades",
        headline: "Na medida certa para o seu salão",
        descricao:
          "Shampoo e condicionador de tratamento em 1,5L, com argan, macadâmia, nano queratina e pantenol, para preparar o cabelo para os serviços do salão.",
        beneficios: ["Lavagem especial e hidratante", "Limpeza profunda", "Formato profissional de 1,5L"],
        rendimento: "1 shampoo + 1 condicionador = 100 aplicações",
        imagem: "/images/marcas/olenka/especialidades.webp",
      },
    ],
  },
  {
    nome: "Finalizadores",
    linhas: [
      {
        slug: "happy-end",
        nome: "Happy End",
        headline: "A linha completa de finalizadores para fechar cada serviço",
        descricao:
          "Sete finalizadores com propósitos específicos: CC Cream Leave-in 13x1, Óleo de Reparação, Spray de Brilho, Hair Brushing, Lipid Serum, Pó Modelador e Secret Curl.",
        beneficios: [
          "CC Cream com 13 benefícios em um produto",
          "Óleos, séruns e sprays para cada tipo de finalização",
          "Do liso ao cacheado, com um produto próprio para cada",
        ],
        imagem: "/images/marcas/olenka/happy-end.webp",
      },
    ],
  },
  {
    nome: "Home care",
    linhas: [
      {
        slug: "self-care",
        nome: "Self Care",
        headline: "A durabilidade do salão para suas clientes",
        descricao:
          "Linha home care segmentada por tipo de cabelo: cacheados, claros/descoloridos, regeneração intensa e lisos/alisados, cada um com ativos específicos.",
        beneficios: ["Uma formulação por tipo de cabelo", "Shampoo e Dual Mousse", "Estende o resultado do serviço de salão"],
        imagem: "/images/marcas/olenka/self-care.webp",
      },
      {
        slug: "self-care-plus",
        nome: "Self Care+",
        headline: "Manutenção de alta performance",
        descricao:
          "Sistema Dual Mask home care em quatro focos: Oil Control, Intense Hydration, High Nutrition e Blond Protect.",
        beneficios: ["Sistema Dual Mask", "Quatro focos de tratamento", "Alta performance em casa"],
        imagem: "/images/marcas/olenka/self-care-plus.webp",
      },
    ],
  },
  {
    nome: "Couro cabeludo & anti-queda",
    linhas: [
      {
        slug: "therapy",
        nome: "Therapy",
        headline: "Couro cabeludo saudável, para cabelos fortes e cheio de vitalidade",
        descricao:
          "Exfoliante de couro cabeludo e shampoo purificante, testados dermatologicamente, com o ativo exclusivo OKnexil Technology.",
        beneficios: ["Desobstrução do bulbo capilar", "Purifica e equilibra o pH do couro cabeludo", "Estimula o crescimento capilar"],
        rendimento: "Esfoliante 25 aplicações · Shampoo 45 aplicações",
        imagem: "/images/marcas/olenka/therapy.webp",
      },
      {
        slug: "growth-splash",
        nome: "Growth Splash",
        headline: "Tônico anti-queda feminino",
        descricao:
          "Tônico à base de água com eficácia comprovada após 4 semanas, estimulando o nascimento de novos fios sem deixar o cabelo oleoso.",
        beneficios: ["Eficácia comprovada após 4 semanas", "Pode ser usado todos os dias", "Não interfere na cor ou no alisamento"],
        imagem: "/images/marcas/olenka/growth-splash.webp",
      },
    ],
  },
  {
    nome: "Men's Care",
    linhas: [
      {
        slug: "mens-care",
        nome: "Men's Care",
        headline: "Tratamento e eficácia comprovada para cabelo e couro cabeludo",
        descricao:
          "Linha completa para o público masculino com Aloe Vera, Tea Tree, Menta, Alantoína e o ativo exclusivo OKnexil: shampoo, condicionador, balm pré/pós-barba, óleo e tônico anti-queda 2x1.",
        beneficios: ["Controle de oleosidade, caspa e queda", "Versões profissional (1,5L) e home care", "Tônico anti-queda com eficácia após 4 semanas"],
        imagem: "/images/marcas/olenka/mens-care.webp",
      },
    ],
  },
];

export const allLines: ProductLine[] = categories.flatMap((c) => c.linhas);
