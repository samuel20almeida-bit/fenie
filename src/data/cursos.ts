// Fenié Academy — modalidades e agenda confirmada, transcritas do site
// anterior (feniecosmeticos.com.br/cursosfeniepro). Datas e formatos são
// informação comercial: revisar a cada virada de agenda antes de publicar.

export interface Modalidade {
  slug: string;
  nome: string;
  descricao: string;
}

export const modalidades: Modalidade[] = [
  {
    slug: "formacao-profissional",
    nome: "Formação Profissional",
    descricao:
      "Cursos completos para quem está iniciando ou quer estruturar a carreira no salão com base técnica sólida e prática real.",
  },
  {
    slug: "cursos-tecnicos",
    nome: "Cursos Técnicos",
    descricao:
      "Aperfeiçoamento em corte, coloração, mechas, alisamento e tratamentos, com foco em aplicação prática e resultado no salão.",
  },
  {
    slug: "workshops-imersoes",
    nome: "Workshops & Imersões",
    descricao:
      "Treinamentos intensivos, atualizações e eventos com educadores convidados e técnicas avançadas.",
  },
];

export interface Curso {
  slug: string;
  nome: string;
  /** Educador convidado, quando o curso é assinado por alguém. */
  educador?: string;
  descricao: string;
  /** Bloco de data: linha grande + linha curta (ex.: "16-17" / "Mar 26"). */
  dataTopo: string;
  dataBase: string;
  local: string;
  /** Formato, preço, vagas — o que aparecer na agenda oficial. */
  detalhes: string[];
  /** Curso exibido no teaser da home. */
  destaque?: boolean;
}

export const cursos: Curso[] = [
  {
    slug: "formacao-profissional-cabeleireiro",
    nome: "Formação Profissional de Cabeleireiro — Turma Março 2026",
    descricao:
      "Formação completa para quem quer entrar na profissão ou evoluir com base técnica sólida e prática real.",
    dataTopo: "Mar",
    dataBase: "2026",
    local: "Fenié Academy · Curitiba",
    detalhes: ["Início previsto para março"],
    destaque: true,
  },
  {
    slug: "make-business-mup-makeup",
    nome: "MAKE & BUSINESS — Treinamento Oficial MUP MAKEUP",
    descricao:
      "Encontro para quem já revende ou quer começar na MUP: o método SPEED GLOW e como vender maquiagem todos os dias, com demonstração.",
    dataTopo: "23",
    dataBase: "Fev 26",
    local: "Fenié Academy · Curitiba",
    detalhes: ["Gratuito", "Vagas limitadas"],
  },
  {
    slug: "hair-fusion-tour-simony-santana",
    nome: "HAIR FUSION TOUR",
    educador: "Simony Santana",
    descricao:
      "Imersão em mechas, coloração e tendências atuais, com foco em naturalidade, sofisticação e segurança técnica.",
    dataTopo: "16-17",
    dataBase: "Mar 26",
    local: "Hotel Lizon + Fenié Academy · Curitiba",
    detalhes: ["1 dia ou combo 2 dias"],
  },
  {
    slug: "creativity-marcio-fiorucci",
    nome: "CREATIVITY",
    educador: "Márcio Fiorucci",
    descricao:
      "Criatividade aplicada ao salão: visão artística, identidade profissional e posicionamento. Curso prático, turma reduzida.",
    dataTopo: "18",
    dataBase: "Mai 26",
    local: "Fenié Academy · Curitiba",
    detalhes: ["9h às 17h", "Turma reduzida"],
  },
];

export const cursoDestaque = cursos.find((c) => c.destaque) ?? cursos[0];

/** Educadores convidados que assinam algum curso da agenda. */
export const educadores = cursos
  .filter((c) => c.educador)
  .map((c) => ({ nome: c.educador!, curso: c.nome, slug: c.slug }));
