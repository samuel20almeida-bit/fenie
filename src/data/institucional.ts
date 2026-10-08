// Conteúdo institucional transcrito do site anterior (feniecosmeticos.com.br
// /about e home). Números e depoimentos são afirmações da empresa e de
// clientes: não editar sem confirmar com a Fenié.

export const missao =
  "Oferecer suporte completo ao salão por meio de produtos profissionais, capacitação e relacionamento humano, com foco em resultado técnico e comercial.";

export const visao =
  "Ser referência no sul do Brasil como a distribuidora mais admirada e transformadora para o mercado da beleza profissional.";

export interface Numero {
  valor: string;
  label: string;
}

export const numeros: Numero[] = [
  { valor: "12", label: "anos de operação" },
  { valor: "+400", label: "atendimentos por mês" },
  { valor: "95%", label: "das entregas em menos de 48h" },
  { valor: "+1.000", label: "aplicações profissionais com produtos Fenié" },
];

// Declaração institucional que aparece assinada pelo CEO na home do site
// anterior. Não é uma fala em primeira pessoa: é o texto da empresa com a
// assinatura dele embaixo — por isso entra como declaração assinada, e não
// como citação entre aspas. Se o Osvaldir mandar uma frase própria, é aqui
// que ela substitui este texto.
export const declaracao = {
  // Título vem do bloco equivalente em /about; o da home repetia "12 anos",
  // que a faixa de números logo acima já mostra.
  titulo: "Potencializamos salões e profissionais com técnica, resultado e inovação.",
  texto:
    "Na Fenié Pro, conectamos salões de beleza e cabeleireiros às marcas mais inovadoras e profissionais do mercado. Com atendimento consultivo, suporte técnico e logística ágil, entregamos muito mais do que produtos: entregamos confiança e transformação.",
  assinatura: { nome: "Osvaldir Niejelski", cargo: "CEO · Fenié Pro" },
};

export const diferenciais: string[] = [
  "Logística ágil e entregas programadas",
  "Atendimento comercial humanizado",
  "Treinamentos técnicos contínuos",
  "Produtos profissionais de alta performance",
  "Marcas exclusivas e inovadoras",
  "Suporte pós-venda e fidelização",
];

// Os 5 motivos vieram da seção "Por Que Muitos Estão Migrando para a FENIÉ".
// Cada um é uma afirmação com um contraponto embutido — mesma gramática do
// bloco Sai/Entra no topo da página, por isso a divisão em duas partes.
export interface Motivo {
  n: string;
  titulo: string;
  contra: string;
}

export const motivos: Motivo[] = [
  { n: "01", titulo: "Marcas exclusivas", contra: "fora de casas de cosméticos" },
  { n: "02", titulo: "Suporte técnico de verdade", contra: "não só entrega" },
  { n: "03", titulo: "Kits e combos pensados no salão", contra: "não no estoque" },
  { n: "04", titulo: "Relacionamento humanizado", contra: "sem burocracia" },
  { n: "05", titulo: "Formação contínua", contra: "não apenas vendas" },
];

// A leitura da realidade do salão. Cada item é o outro lado de um dos
// `motivos` acima — que vieram da seção "Por Que Muitos Estão Migrando para a
// FENIÉ" do site anterior. Ou seja: não é dor inventada para soar consultivo,
// é exatamente o que a própria Fenié já afirma resolver, dito do ponto de
// vista de quem vive o problema. Não acrescentar item sem origem real.
// Os títulos ficam em caixa mista aqui e sobem para caixa alta pelo CSS:
// o texto acessível continua natural para leitor de tela, e a decisão de
// estilo fica num lugar só, no componente.
export interface Realidade {
  n: string;
  titulo: string;
  texto: string;
  /** Qual `motivo` sustenta esta leitura — rastreabilidade, não exibido. */
  origem: string;
}

export const realidade: Realidade[] = [
  {
    n: "01",
    titulo: "Catálogo cheio não significa escolha certa",
    texto:
      "Entre dezenas de produtos parecidos, escolher sozinho custa tempo, dinheiro e pode deixar o estoque parado.",
    origem: "03 · kits pensados no salão, não no estoque",
  },
  {
    n: "02",
    titulo: "Entrega no prazo é obrigação. Suporte é diferencial",
    texto:
      "Quando surge uma dúvida, o salão precisa de alguém que responda com rapidez e atenção. Não de mais um número de pedido.",
    origem: "02 · suporte técnico de verdade, não só entrega",
  },
  {
    n: "03",
    titulo: "Produto comum não constrói posicionamento",
    texto:
      "Trabalhar com as mesmas linhas que todo mundo deixa seu serviço mais parecido. A escolha certa pode ajudar seu salão a ser lembrado.",
    origem: "01 · marcas exclusivas, fora de casas de cosméticos",
  },
  {
    n: "04",
    titulo: "Sua equipe precisa continuar evoluindo",
    texto:
      "Técnica não pode depender de oportunidade. Conhecimento precisa fazer parte da rotina.",
    origem: "05 · formação contínua, não apenas vendas",
  },
  {
    n: "05",
    titulo: "Crescer sozinho custa mais",
    texto:
      "Quando produto, conhecimento e suporte não caminham juntos, cada decisão fica mais difícil.",
    // Fecha a seção abrindo o Método: é a tese dos três movimentos ditos
    // do ponto de vista de quem sente a falta deles.
    origem: "04 · relacionamento humanizado + ponte para o Método",
  },
];

// O Método Fenié agrupa em três movimentos as seis etapas reais que já estavam
// descritas em SolutionsList.astro (Escolha, Técnica, Capacitação, Venda,
// Reposição, Relacionamento). Não é processo novo nem promessa nova: é o
// mesmo trabalho, nomeado. A página /solucoes segue detalhando as seis.
export interface EtapaMetodo {
  n: string;
  titulo: string;
  texto: string;
  /** Etapas de /solucoes que este movimento cobre. */
  cobre: string[];
}

export const metodo: EtapaMetodo[] = [
  {
    n: "01",
    titulo: "Entender",
    texto:
      "Antes de indicar qualquer linha, a gente entende o salão: perfil de atendimento, serviços que mais rodam, realidade da equipe e o que já não está funcionando.",
    cobre: ["Escolha"],
  },
  {
    n: "02",
    titulo: "Desenvolver",
    texto:
      "A linha certa chega junto com o encaminhamento técnico e o acesso aos cursos da Fenié Academy — para a equipe aplicar com segurança, não só para o produto entrar no estoque.",
    cobre: ["Técnica", "Capacitação"],
  },
  {
    n: "03",
    titulo: "Acompanhar",
    texto:
      "Depois do primeiro pedido o consultor continua: reposição no ritmo do salão, oportunidades comerciais e suporte quando aparece dúvida. É aqui que a relação vira parceria.",
    cobre: ["Venda", "Reposição", "Relacionamento"],
  },
];

// Depoimentos reais de clientes, na curadoria e na ordem de prioridade que a
// Fenié entregou. `peso` define a hierarquia da seção — um destaque, dois
// principais e três complementares — para não virar parede de seis cards
// iguais. A categoria de cada um vira a eyebrow do card.
//
// Regras de edição (do próprio material): não reescrever para soar
// publicitário, não inventar cargo, empresa ou foto, não mudar o sentido.
// A única correção aplicada é de digitação evidente, do jeito que o site
// anterior já fazia: no depoimento da Simone, "os produtos então
// maravilhosos" → "são". Nenhuma outra palavra foi tocada.
export interface Depoimento {
  texto: string;
  autor: string;
  /** Categoria do depoimento — vira a eyebrow do card. */
  categoria: string;
  peso: "destaque" | "principal" | "complementar";
}

export const depoimentos: Depoimento[] = [
  {
    texto:
      "Não foi apenas um dia de dicas sobre técnicas e procedimentos de salão de beleza, mas um curso que conversa com o teu íntimo e te lembra quem você nasceu pra ser.",
    autor: "Letícia Antunes",
    categoria: "Experiência · Educação",
    peso: "destaque",
  },
  {
    texto:
      "Minha experiência com a distribuidora Fenié é de alavanca profissional, de recomeçar e me permitir evoluir...",
    autor: "Irayma Ribas",
    categoria: "Desenvolvimento profissional",
    peso: "principal",
  },
  {
    texto:
      "Sempre que preciso estão ali para me atender! Se preciso de algo urgente, eles fazem de tudo para me entregar! Recomendo demais, e não troco por nada.",
    autor: "Angelita Araújo",
    categoria: "Atendimento · Relacionamento",
    peso: "principal",
  },
  {
    texto:
      "Atingiu todas as minhas expectativas, pois aprendi detalhes que em todos os meus anos de curso nunca tinha recebido.",
    autor: "Carol Alencar",
    categoria: "Educação · Conhecimento técnico",
    peso: "complementar",
  },
  {
    texto: "Consultores capacitados, preços mais competitivos e atendimento técnico.",
    autor: "Anaruez Virmond",
    categoria: "Consultoria · Atendimento técnico",
    peso: "complementar",
  },
  {
    texto:
      "Atendimento perfeito, chegou tudo certinho, equipe muito atenciosa e os produtos são maravilhosos, entrega rápida!! Super recomendo.",
    autor: "Simone Linzmeyer",
    categoria: "Produtos · Atendimento · Logística",
    peso: "complementar",
  },
];

export const depoimentoDestaque = depoimentos.find((d) => d.peso === "destaque")!;
export const depoimentosPrincipais = depoimentos.filter((d) => d.peso === "principal");
export const depoimentosComplementares = depoimentos.filter((d) => d.peso === "complementar");
