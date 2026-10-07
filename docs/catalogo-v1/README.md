# Catálogo Fenié PRO — início da V1

Atualizado em 06/10/2026. Este diretório organiza a execução do documento funcional enviado por Samuel. O documento original está em `escopo-original.md`. A demonstração não é o catálogo comercial e não substitui o Meloja.

## Atualização Mercos — 07/10/2026

A prévia atual usa **701 registros ativos e exibidos, com códigos únicos**, da extração Mercos. Os preços são os de **Preço de Tabela**, conforme confirmado por Samuel. Há **141 fotos oficiais candidatas de cinco marcas** e 560 produtos sem foto. O catálogo anterior de 414 produtos foi reconciliado; cadastros sem correspondência elegível foram retirados da prévia. Detalhes e validação em [mercos.md](mercos.md) e [fotos.md](fotos.md). Pedidos reais continuam desativados.

## Histórico: planilha recebida e importação preparada

Samuel forneceu a planilha de precificação e o link do Meloja. A aba CATALOGO contém 627 registros; 414 passaram pela verificação estrutural da prévia e 213 ficaram em revisão. O laboratório agora usa os campos comerciais desses 414 produtos, com PREÇO PRATICADO, filtro por linha e fotos marcadas como pendentes. Pedidos reais permanecem desativados.

Detalhes em [auditoria-planilha.md](auditoria-planilha.md). A recomendação de revisão dos preços e do WhatsApp continua válida. O acesso ao Meloja foi bloqueado pelo Cloudflare neste navegador; as fotografias e descrições ainda precisam de uma exportação/acervo acessível.

## Decisões confirmadas com Samuel

| Decisão | Definição |
| --- | --- |
| Público | Salões e profissionais da beleza |
| Preços | Públicos, sem login de clientes |
| Jornada | Encontrar → selecionar quantidade → carrinho → resumo → WhatsApp |
| Código | Conta `samuel20almeida-bit`; repositório Fenié existente |
| Dados iniciais | Planilha CATALOGO enviada; Meloja como referência visual a conferir |
| Conclusão comercial | Atendimento confirma disponibilidade, frete, pagamento e condições |
| Escopo | Sem pagamento online, ERP, CRM ou integração de estoque na V1 |

## O que foi preparado nesta entrega

- Branch `feat/catalogo-v1-foundation`, isolada de `main`.
- Demonstração em `/catalogo-lab/`: busca sem sensibilidade a acentos, filtros combinados, ordenação, detalhe de produto, quantidades, carrinho persistente e resumo.
- Mensagem estruturada com SKU, marca, volume, quantidade, preço, subtotal e origem. Na demonstração, somente visualização e cópia; nenhum pedido real é enviado.
- Validação de dados e testes das regras comerciais essenciais, usando valores em centavos.
- Modelo de produtos, backlog com critérios de aceite, recomendação de arquitetura e roteiro de piloto.

## O que ainda não está implementado

Conferência do Meloja, imagens oficiais por SKU, administração no CMS, rotas comerciais individuais, atualização de preços em tempo de execução, coleta de analytics em um destino real e ativação do WhatsApp comercial. Os seis registros ilustrativos originais permanecem somente como fixtures de teste; o laboratório carrega o snapshot comercial em revisão.

## Organização do trabalho

| Etapa | Entrega verificável | Responsável | Dependência |
| --- | --- | --- | --- |
| 1 — Base | Plano, modelo e laboratório de fluxo | Desenvolvimento | Concluída nesta branch |
| 2 — Cadastro | Produtos reais saneados e revisados | Fenié + desenvolvimento | Importação preparada; 213 registros em revisão e fotos pendentes |
| 3 — Administração | Equipe publica produto e preço no painel | Desenvolvimento + responsável do catálogo | Projeto CMS e acessos |
| 4 — Catálogo real | URLs, carrinho, revisão e WhatsApp funcionando | Desenvolvimento | Cadastro e número aprovados |
| 5 — Validação | Testes internos em Android, iPhone e desktop | Fenié + desenvolvimento | Preview com dados reais |
| 6 — Piloto | 20–50 clientes por 7–14 dias | Comercial | Validação interna |
| 7 — Migração | Links oficiais apontam ao novo catálogo | Fenié + desenvolvimento | Aprovação dos resultados do piloto |

As etapas 2 e 3 podem avançar em paralelo. O prazo de construção será estimado após conhecer o volume de SKUs e a qualidade da exportação. O piloto acrescenta 7–14 dias ao calendário.

## Dados para a próxima etapa

1. Fotos oficiais/descrições ou exportação do Meloja que permita complementar a planilha já lida. O link foi recebido, mas este navegador foi bloqueado pelo Cloudflare.
2. Confirmação do WhatsApp de pedidos. O protótipo e o site existente usam `+55 41 99840-2800`, mas atendimento institucional e pedidos podem ter destinos diferentes.
3. Nome de quem revisará preços, produtos e alterações no painel. Também definir quem confirma as solicitações recebidas no WhatsApp.

Não enviar senhas ou tokens na conversa. Os acessos de administração deverão ser concedidos diretamente às contas autorizadas.

## Como conferir esta base

```bash
npm ci
npm run test:catalog
npm run validate:catalog -- public/catalogo-lab/catalog-preview.json
npm run build
npm run dev
```

Abrir `/catalogo-lab/`. A página é responsiva e marcada como `noindex`. As URLs com `#` são exclusivas do laboratório; as URLs finais estão descritas em `arquitetura.md`. Para conferir as regras de importação, executar `python3 tests/import_fenie_sheet_test.py`.

Documentos de execução: `arquitetura.md`, `backlog.md`, `dados-e-migracao.md` e `piloto.md`. O arquivo `modelo-produtos.csv` contém somente cabeçalhos para a coleta dos dados reais.
