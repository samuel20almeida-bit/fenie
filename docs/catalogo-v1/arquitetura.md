# Arquitetura recomendada

Status: recomendação técnica para a próxima implementação; CMS e infraestrutura dinâmica ainda não foram provisionados.

## Aproveitar o que existe

O repositório já contém Astro 7, TypeScript, Tailwind 4, imagens de marca, biblioteca de WhatsApp e configuração de analytics do institucional. Existe o projeto `fenie` na Vercel, com Node 24 e uma implantação de produção pronta. Isso permite desenvolver o catálogo sem reescrever o institucional.

A lista de produtos Olenka existente descreve linhas, não necessariamente SKUs comerciais. Ela não deve ser tratada como catálogo de venda com preços ou estoque.

## Componentes propostos

| Componente | Escolha | Papel |
| --- | --- | --- |
| Interface | Astro + TypeScript + Tailwind existentes | Catálogo responsivo com poucas dependências |
| Hospedagem | Projeto Vercel da Fenié | Preview por branch e release do catálogo |
| Conteúdo administrável | Sanity Studio + Content Lake | Produtos, marcas, categorias, imagens e configuração comercial |
| Leitura do conteúdo | Camada de servidor usando GROQ | Consultar somente conteúdo publicado |
| Rotas dinâmicas | Adapter Vercel; catálogo renderizado sob demanda | Produtos novos e preços publicados sem deploy manual |
| Carrinho | Navegador; IDs e quantidades, expiração de 30 dias | Sem cadastro; preço sempre obtido do catálogo atual |
| Analytics | GA4 se disponível; eventos próprios do catálogo | Medir intenção, sem classificar clique como venda |

Sanity reduz o trabalho de construir e manter um painel administrativo próprio. O institucional pode continuar estático. Catálogo e APIs precisam de leitura em tempo de execução: buscar o CMS somente durante o build não atende ao requisito de atualizar preço sem deploy.

Não será necessário um banco transacional de pedidos na V1. Um pedido salvo ou integração de faturamento será uma decisão futura.

## Rotas comerciais propostas

| Rota | Função |
| --- | --- |
| `/catalogo` | Entrada, busca e filtros |
| `/catalogo/marca/[slug]` | Produtos de uma marca |
| `/catalogo/categoria/[slug]` | Produtos de uma categoria |
| `/catalogo/produto/[slug]` | Um SKU |
| `/catalogo/carrinho` | Revisar e editar quantidades |
| `/catalogo/resumo` | Identificação opcional e mensagem |

O prefixo mantém o catálogo separado das páginas institucionais e das atuais páginas `/marcas`. Um subdomínio dedicado poderá usar as mesmas rotas após definição de domínio; não foi feita alteração de DNS.

## Atualização comercial

1. Editor autorizado publica a alteração no Studio.
2. O catálogo consulta documentos publicados, com cache curto a definir e testar; alvo inicial de atualização em até 60 segundos para navegação.
3. Ao abrir resumo e antes de abrir o WhatsApp, o servidor relê os SKUs sem cache. Preço alterado é apresentado para revisão; SKU oculto, removido ou indisponível bloqueia a intenção até corrigir o carrinho.
4. Carrinho persiste somente identificadores e quantidades, nunca uma tabela congelada de preços.

O laboratório já utiliza centavos inteiros e revalida os itens contra os dados carregados. A atualização de servidor acima pertence à próxima etapa.

## Administração e configuração

Tipos de conteúdo: `product`, `brand`, `category` e configuração única `catalogSettings`. Um SKU por registro, incluindo tamanho e, em colorações, nuance. O painel precisa de validações para preço, SKU, slug, referências e imagem.

`catalogSettings` centralizará `whatsappOrders`, mensagem de aviso e campanha principal. O número deve ser validado como telefone brasileiro internacional, com DDI 55. Publicar a configuração deve atualizar o destino sem novo deploy.

Somente membros autorizados editam o CMS. Catálogo público não expõe credenciais de escrita. Em dataset público, manter somente conteúdo que a Fenié aceita tornar público: não incluir custo, margem, clientes ou negociações internas. Rascunhos ficam fora das consultas públicas. Verificar permissões antes de conectar o dataset real.

## Origem e analytics

Capturar `seller` ou `vendedor`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `campanha`. Regra inicial: última origem informada na sessão; parâmetros ausentes continuam com o valor anterior. O identificador não gera comissão, não autentica vendedor e não muda preço.

Eventos: `view_catalog`, `search`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `whatsapp_order_click`. Não enviar nome/salão, telefone, conteúdo da mensagem ou texto livre da busca ao analytics. O laboratório preserva atribuição para conferir a mensagem, mas não envia eventos a provedores.

`whatsapp_order_click` mede abertura pretendida do WhatsApp. A confirmação de envio e a venda real dependem do atendimento; não usar evento `purchase`.

## Referências do 21st.dev selecionadas

- [Ecommerce Category Page](https://21st.dev/@mohammadshehadeh/components/ecommerce-04): filtros móveis, filtros removíveis, ordenação e estado sem resultado. Adaptar aos dois filtros da V1; não trazer avaliações, cores e filtros excessivos.
- [Product Listing Card](https://21st.dev/@hello_a52e1bda/components/product-card-1): hierarquia de imagem, nome, preço e adicionar. Incluir tamanho e quantidade como requisitos da Fenié.
- [Shop by Category Grid](https://21st.dev/@ziegfiroyt/components/ecommerce4): referência para navegação por marcas/categorias quando existirem imagens oficiais.

Foram pesquisadas as referências e seus metadados; o código React desses componentes não foi integrado. O laboratório usa a experiência do protótipo enviado, com estilos próprios. Avaliar componentes antes de adicionar React somente para uma interação que o Astro já resolve.

## Custos e release

Custos recorrentes a confirmar no painel: plano comercial da Vercel, plano/uso do CMS, domínio e eventuais ferramentas de analytics. Não houve contratação de plano nem criação de recurso pago. O uso comercial não cabe no plano Hobby da Vercel; verificar se o workspace atual já é Pro antes de lançar.

Desenvolver em branch, executar testes e build, revisar o preview, testar o catálogo real, pilotar e só depois publicar os links comerciais. Não substituir Meloja durante validação. O catálogo anterior será o caminho de retorno caso haja erro de preço, conteúdo ou pedido.

Documentação consultada em 06/10/2026:

- https://www.sanity.io/docs/astro
- https://www.sanity.io/docs/astro/static-and-server-rendering
- https://www.sanity.io/docs/astro/configure-sanity-astro
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/plans/hobby
