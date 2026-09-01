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

// Depoimentos reais publicados no site anterior. Só os erros evidentes de
// digitação do original foram corrigidos ("guenhei" → "ganhei", "então" →
// "são"); a voz de cada cliente segue intacta.
export interface Depoimento {
  texto: string;
  autor: string;
  papel: string;
}

export const depoimentos: Depoimento[] = [
  {
    texto:
      "Atendimento perfeito, chegou tudo certinho, equipe muito atenciosa e os produtos são maravilhosos, entrega rápida! Super recomendo.",
    autor: "Simone L.",
    papel: "Cabeleireira",
  },
  {
    texto:
      "Chegou antes do esperado. Todos os produtos certos e ainda ganhei uns mimos. Amei, obrigada Fenié.",
    autor: "Denise dos Santos",
    papel: "Cliente Fenié",
  },
];
