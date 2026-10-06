# Catálogo Fenié PRO — início da V1

Atualizado em 06/10/2026. Este diretório organiza a execução do documento funcional enviado por Samuel. O documento original está em `escopo-original.md`. A demonstração não é o catálogo comercial e não substitui o Meloja.

## Decisões confirmadas com Samuel

| Decisão | Definição |
| --- | --- |
| Público | Salões e profissionais da beleza |
| Preços | Públicos, sem login de clientes |
| Jornada | Encontrar → selecionar quantidade → carrinho → resumo → WhatsApp |
| Código | Conta `samuel20almeida-bit`; repositório Fenié existente |
| Dados iniciais | Exportação do catálogo atual do Meloja |
| Conclusão comercial | Atendimento confirma disponibilidade, frete, pagamento e condições |
| Escopo | Sem pagamento online, ERP, CRM ou integração de estoque na V1 |

## O que foi preparado nesta entrega

- Branch `feat/catalogo-v1-foundation`, isolada de `main`.
- Demonstração em `/catalogo-lab/`: busca sem sensibilidade a acentos, filtros combinados, ordenação, detalhe de produto, quantidades, carrinho persistente e resumo.
- Mensagem estruturada com SKU, marca, volume, quantidade, preço, subtotal e origem. Na demonstração, somente visualização e cópia; nenhum pedido real é enviado.
- Validação de dados e testes das regras comerciais essenciais, usando valores em centavos.
- Modelo de produtos, backlog com critérios de aceite, recomendação de arquitetura e roteiro de piloto.

## O que ainda não está implementado

Importação real do Meloja, imagens oficiais por SKU, administração no CMS, rotas comerciais individuais, atualização de preços em tempo de execução, coleta de analytics em um destino real e ativação do WhatsApp comercial. O laboratório usa seis registros ilustrativos do protótipo; SKUs `DEMO-*` foram criados só para testar o formato.

## Organização do trabalho

| Etapa | Entrega verificável | Responsável | Dependência |
| --- | --- | --- | --- |
| 1 — Base | Plano, modelo e laboratório de fluxo | Desenvolvimento | Concluída nesta branch |
| 2 — Cadastro | Produtos reais saneados e revisados | Fenié + desenvolvimento | Exportação do Meloja |
| 3 — Administração | Equipe publica produto e preço no painel | Desenvolvimento + responsável do catálogo | Projeto CMS e acessos |
| 4 — Catálogo real | URLs, carrinho, revisão e WhatsApp funcionando | Desenvolvimento | Cadastro e número aprovados |
| 5 — Validação | Testes internos em Android, iPhone e desktop | Fenié + desenvolvimento | Preview com dados reais |
| 6 — Piloto | 20–50 clientes por 7–14 dias | Comercial | Validação interna |
| 7 — Migração | Links oficiais apontam ao novo catálogo | Fenié + desenvolvimento | Aprovação dos resultados do piloto |

As etapas 2 e 3 podem avançar em paralelo. O prazo de construção será estimado após conhecer o volume de SKUs e a qualidade da exportação. O piloto acrescenta 7–14 dias ao calendário.

## Dados para a próxima etapa

1. Exportação do Meloja, com preços e identificadores, e o link do catálogo atual para conferência visual. A disponibilidade de exportação será verificada; não foi presumida uma API de integração.
2. Confirmação do WhatsApp de pedidos. O protótipo e o site existente usam `+55 41 99840-2800`, mas atendimento institucional e pedidos podem ter destinos diferentes.
3. Nome de quem revisará preços, produtos e alterações no painel. Também definir quem confirma as solicitações recebidas no WhatsApp.

Não enviar senhas ou tokens na conversa. Os acessos de administração deverão ser concedidos diretamente às contas autorizadas.

## Como conferir esta base

```bash
npm ci
npm run test:catalog
npm run validate:catalog -- public/catalogo-lab/demo.json
npm run build
npm run dev
```

Abrir `/catalogo-lab/`. A página é responsiva e marcada como `noindex`. As URLs com `#` são exclusivas do laboratório; as URLs finais estão descritas em `arquitetura.md`.

Documentos de execução: `arquitetura.md`, `backlog.md`, `dados-e-migracao.md` e `piloto.md`. O arquivo `modelo-produtos.csv` contém somente cabeçalhos para a coleta dos dados reais.
