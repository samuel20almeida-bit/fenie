// Dados institucionais e de contato — fonte única para footer, página de
// contato e JSON-LD. Vieram do site anterior (feniecosmeticos.com.br), que
// os repete em todas as páginas. Alterar aqui reflete no site inteiro.

export const empresa = {
  nome: "Fenié Pro",
  descricaoCurta:
    "Produtos profissionais, conhecimento técnico e suporte comercial para salões e profissionais da beleza.",

  endereco: {
    logradouro: "Rua Dr. Goulin, 1123",
    bairro: "Juvevê",
    cidade: "Curitiba",
    uf: "PR",
    pais: "BR",
  },

  // telefone: exibição para humano · e164 para href="tel:"
  telefone: "(41) 99840-2800",
  telefoneE164: "+5541998402800",
  email: "contato@feniecosmeticos.com.br",

  // horario: exibição para humano · schema no formato OpeningHoursSpecification
  horario: "Segunda a sexta, 8h às 18h",
  horarioDias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  horarioAbre: "08:00",
  horarioFecha: "18:00",

  redes: [
    { label: "Instagram", handle: "@feniepro", href: "https://www.instagram.com/feniepro/" },
    { label: "Facebook", handle: "/feniepro", href: "https://www.facebook.com/feniepro" },
    { label: "YouTube", handle: "@feniepro", href: "https://www.youtube.com/@feniepro" },
  ],
} as const;

export const enderecoLinha = `${empresa.endereco.logradouro} — ${empresa.endereco.bairro}, ${empresa.endereco.cidade}/${empresa.endereco.uf}`;

export const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${empresa.endereco.logradouro}, ${empresa.endereco.bairro}, ${empresa.endereco.cidade} - ${empresa.endereco.uf}`
)}`;
