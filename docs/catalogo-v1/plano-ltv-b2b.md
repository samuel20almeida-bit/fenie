# Plano de ação — catálogo B2B, bancada e recorrência

Atualizado em 08/10/2026. Direção aprovada por Samuel: salões e gestores são o público principal; B2C tem participação secundária. Olenka é a marca prioritária. O catálogo deve apoiar serviços, revenda ao cliente do salão e reposição, trabalhando a retenção do salão na Fenié e a continuidade do relacionamento entre salão e cliente.

## Execução em etapas

| Etapa | Entrega | Critério de aceite | Situação |
| --- | --- | --- | --- |
| 1 — Início | Entradas por objetivo, seleção profissional e bancada Olenka; quatro fichas de cuidados em casa; complementares com motivo; três dicas para salões; lista de reposição | Filtros compõem; conteúdo tem fonte; lista guarda somente IDs/quantidades e usa preços atuais; nenhuma adição automática | Implementada na prévia desta branch; pedidos reais desativados |
| 2 — Conteúdo | Completar fotos e fichas das linhas Olenka, classificar produtos por serviço e revenda com o comercial | Foto corresponde ao SKU e embalagem; indicação e modo de uso revisados; não inferir indicação apenas pelo volume | Próxima entrega |
| 3 — Operação | Validar condições, destino do WhatsApp e atendimento; pilotar com salões | Produtos, preços, estoque e embalagens conferidos; solicitações conciliadas com pedidos reais; teste Android/iPhone | Depende da conferência comercial e piloto |
| 4 — Retenção e medição | Conectar pedidos confirmados, identificar coortes, avaliar recompra e LTV; depois testar acompanhamento e listas por conta | Separar intenção de pedido confirmado; controles de acesso; mensagens somente com regras e autorização de contato definidas | Planejada; sem CRM, campanhas ou analytics provisionados |

Não é necessário ativar pedidos reais para avaliar a experiência da etapa 1. Lista salva não é pedido anterior nem assinatura: existe somente neste navegador e expira em até 30 dias. Compartilhamento entre dispositivos e histórico real ficam para uma etapa com contas e pedidos confirmados.

## Psicologia do consumidor aplicada

O termo neuromarketing orienta uma experiência a testar; esta entrega não mede atividade cerebral nem promete efeito causal em vendas. As intervenções usam objetivos claros, informação verificável e controle do comprador.

| Princípio | Aplicação | Hipótese verificável |
| --- | --- | --- |
| Facilidade de decisão | Três entradas: serviços, bancada e reposição; seleção explícita em vez de classificação de todos os 701 SKUs por suposição | Gestores encontram produtos adequados com menos esforço |
| Clareza do benefício | Indicação e orientação aparecem na ficha; guia curto para a equipe explicar o cuidado em casa | Mais visitas qualificadas à ficha chegam à seleção do produto |
| Relevância dos complementares | Royal Care + Happy End têm relação documentada; complementares ficam na ficha, sem adição automática e sem duplicar itens já incluídos no kit | Pedidos incluem complementares úteis, sem aumentar erros ou desistências |
| Memória e familiaridade | Lista de reposição editável, com valores recalculados e quantidades explícitas | Clientes recorrentes montam a próxima seleção com menos esforço |
| Utilidade antes da oferta | Dicas sobre bancada, conversa com o cliente e reposição pelo giro real | Salões retornam e usam o catálogo como ferramenta de trabalho |

A escolha entre comprar unidades ou o kit usa os preços de tabela reais de cada SKU Mercos. Não há desconto criado, preço riscado, seleção de quantidade em lote, ranking de vendas, prova social, contagem regressiva ou escassez sem evidência.

## Primeira seleção Olenka

- Serviços: cinco produtos fotografados, escolhidos explicitamente entre os destaques já existentes. É uma seleção inicial, não uma lista exaustiva de uso profissional.
- Bancada: Shampoo Royal Care, Dual Mask Royal Care, Kit Royal Care e CC Cream Happy End. A linha de manutenção é indicada a lisos naturais/alisados; escolha e orientação continuam dependentes da avaliação profissional.
- Fichas: resumos breves de quatro produtos, mantendo os nomes, embalagens e preços Mercos. A falta de foto não bloqueia informação conferida; marcadores de foto pendente permanecem.
- Complementares: shampoo e máscara como itens separados; CC Cream como finalização. Para o kit, sugerir somente o finalizador, sem oferecer novamente seus componentes como complementares.

Fontes oficiais de produto, conferidas em 08/10/2026:

- https://loja.olenkacosmeticos.com.br/produto/dual-mask-royal-care-manutencao-250ml/
- https://loja.olenkacosmeticos.com.br/produto/kit-royal-care-sh-dual-mask-manutencao-250ml/
- https://loja.olenkacosmeticos.com.br/produto/kit-royal-care-sh-dual-mask-manutencao-cc-cream-leave-in-happy-end-250ml/

Os preços das páginas dos fabricantes não são importados.

## Métricas do piloto

Registrar intenção e resultado separadamente. O catálogo desta etapa não envia eventos a um destino de analytics. O registro de eventos abaixo é uma especificação para a instrumentação futura:

| Medida | Fonte e definição |
| --- | --- |
| Uso dos caminhos | `select_goal` com objetivo; `view_item` com SKU; nenhuma busca livre ou dado pessoal no evento |
| Seleção de bancada | `add_to_cart` com SKU, objetivo e contexto; não tratar como venda |
| Uso de dicas/lista | `open_salon_tip`, `save_replenishment`, `load_replenishment`; sem nome do salão ou conteúdo da lista nos eventos |
| Conversão real | Pedidos confirmados pelo comercial / solicitações recebidas, com deduplicação |
| Segunda compra | Salões com uma segunda compra confirmada em 30, 60 e 90 dias, por coorte da primeira compra |
| Frequência e giro | Intervalo entre pedidos confirmados e participação de revenda; separar uso profissional de bancada após classificação comercial |
| LTV | Receita acumulada e contribuição por salão ao longo do relacionamento, após custos/devoluções conhecidos; nenhum cálculo público de margem a partir do preço de tabela |

Criar uma linha de base antes de avaliar aumento. No piloto inicial, observar navegação, montagem de pedidos e dúvidas; retenção exige acompanhamento posterior. Avaliar a seleção por objetivo, complementares e reposição separadamente. Se a base comportar comparação aleatória, testar uma mudança de cada vez; caso contrário, relatar a limitação da comparação antes/depois. Definir metas numéricas depois da linha de base, sem percentuais prometidos.

Referências de pesquisa:

- Scheibehenne, Greifeneder e Todd (2010), *Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload*, DOI https://doi.org/10.1086/651235. A relação entre número de opções e decisão varia com o contexto; seleção menor não garante maior conversão.
- Pesquisa de usabilidade Baymard sobre sugestões alternativas e complementares: https://baymard.com/research-articles/product-page-suggestions. Recomendações devem explicitar seu critério e não pressupor compatibilidade sem conferência.

## Verificação da etapa 1

Testes de seleção B2B, identidade dos SKUs, composição dos filtros, sugestões sem duplicação, revalidação de preços e inclusão atômica da lista. Conferir no navegador: abrir bancada, ler ficha e dica, adicionar produtos, salvar lista, editar quantidade, recarregar e somar ao pedido. O catálogo permanece uma prévia; nenhuma campanha, mensagem a clientes ou compra real é disparada.
