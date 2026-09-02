// Perguntas frequentes — fonte única para a home (FaqAccordion) e para a
// página de contato (Faq). Mesma pergunta em dois lugares divergia sozinha.
export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "A Fenié vende para consumidor final?",
    a: "Não vendemos para consumidor final: atendemos exclusivamente profissionais e salões cadastrados.",
  },
  {
    q: "Como faço para conhecer os preços e condições?",
    a: "Preços e condições comerciais são apresentados por um consultor, ajustados ao perfil e ao volume do seu salão. Fale pelo WhatsApp para receber essas informações.",
  },
  {
    q: "Posso solicitar orientação sobre os produtos?",
    a: "Sim. O atendimento consultivo faz parte do trabalho da Fenié: um consultor te ajuda a entender protocolo, indicação e uso correto das linhas antes e depois da compra.",
  },
  {
    q: "Como funcionam os cursos da Fenié Academy?",
    a: "A Fenié Academy reúne cursos, oficinas e formações com profissionais convidados. A agenda com datas e inscrições abertas fica em /academy.",
  },
  {
    q: "A Fenié atende fora de Curitiba?",
    a: "A operação é baseada em Curitiba e região. Para outras cidades, consulte um consultor sobre disponibilidade e condições de atendimento.",
  },
];
