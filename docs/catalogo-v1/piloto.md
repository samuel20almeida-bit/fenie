# Validação e piloto

## Testes internos antes de atender clientes

| Cenário | Resultado esperado |
| --- | --- |
| 1 unidade, 10 unidades e vários SKUs | Quantidades, preços e subtotal iguais ao cadastro aprovado |
| Adicionar novamente o mesmo SKU | Quantidade somada, sem linha duplicada |
| Diminuir, aumentar e remover | Mínimo 1; inteiros; exclusão pelo botão remover |
| Fechar e reabrir | Carrinho reaparece com IDs e quantidades válidos |
| Preço alterado com carrinho salvo | Preço atualizado apresentado antes de continuar |
| SKU oculto, removido ou indisponível | Resumo bloqueado até corrigir os itens |
| Busca por nome, SKU, marca e termo sem acento | Resultado correto; filtros se combinam |
| Busca sem resultado | Mensagem, limpar filtros e contato comercial |
| Produto com campos opcionais vazios | Tela legível, sem seção vazia ou erro |
| Link direto para SKU | Abre o produto; slug inexistente retorna 404 |
| Nome opcional e vendedor/UTMs | Mensagem correta; origem preservada, sem dados pessoais no analytics |
| Falha de dados e imagem | Estado de erro/nova tentativa ou imagem alternativa |
| Android, iPhone e desktop | Catálogo → carrinho → resumo → WhatsApp passa |
| WhatsApp instalado e WhatsApp Web | Mensagem preenchida, destino correto; usuário faz o envio |
| Carrinho muito longo | Verificar abertura integral; oferecer copiar mensagem se URL exceder limite prático |
| Conexão móvel comum | Produtos e ações utilizáveis, sem depender de animações |
| Editor altera produto no painel | Atualização aparece sem edição de código nem deploy manual |

A base tem testes automatizados de dados, dinheiro, busca, restauração, indisponibilidade, mensagem e origem. Testes com dispositivos reais, CMS e abertura de WhatsApp ficam pendentes até integrar o catálogo comercial.

## Piloto comercial

Selecionar 20–50 clientes por 7–14 dias, conforme o documento funcional. Incluir compradores recorrentes, várias marcas e clientes que já pedem pelo WhatsApp. Manter Meloja disponível durante a validação.

Registrar acessos, buscas, adições, revisões e cliques de WhatsApp. O atendimento registra separadamente solicitações efetivamente recebidas, vendas concluídas, erros, dúvidas e necessidade de ajuda. Sem backend transacional, não prometer cruzamento automático entre analytics e faturamento.

Primeiro medir a situação atual do atendimento: tempo médio para esclarecer itens, erros de produto/tamanho e número de mensagens por pedido. Depois comparar com os pedidos do catálogo. As metas numéricas serão definidas com esse baseline.

## Aprovação e retorno

Aprovar migração quando clientes conseguem usar o fluxo sem orientação frequente, equipe consegue manter o cadastro e não há problema crítico de preço, SKU ou mensagem. Diante desses erros, interromper o piloto, corrigir e repetir os casos afetados.

Após aprovação: atualizar os links oficiais, monitorar atendimento e só então decidir quando desativar Meloja. Se surgirem falhas críticas, direcionar clientes de volta ao catálogo anterior até corrigir.
