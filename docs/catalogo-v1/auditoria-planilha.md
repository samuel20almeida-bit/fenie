# Importação da planilha — 06/10/2026

Fonte lida: planilha `Precificacao_Fenie_PRO_Atualizada_1506_V3`, aba `CATALOGO`, fornecida por Samuel. O arquivo original permanece sem alterações. Importação feita a partir dos valores calculados presentes no arquivo exportado; não recalculamos as fórmulas do Google Sheets.

## Resultado

| Verificação | Registros |
| --- | ---: |
| Linhas com cadastro | 627 |
| SKUs distintos | 626 |
| Itens que passaram nas regras estruturais da prévia | 414 |
| Registros retidos para revisão | 213 |
| Preço praticado ausente | 23 |
| Marca ausente | 7 |
| Linha ausente | 23 |
| Situação não preenchida como Ativo | 19 |
| Embalagem/volume não explícito na descrição | 184 |
| Registros envolvidos em SKU duplicado | 2 |

Um registro pode ter várias pendências. Portanto, somar pendências não resulta no total de registros retidos. Os números do dashboard da fonte podem diferir da contagem do cadastro atual; esta importação percorreu os registros da aba CATALOGO.

`MAK-SOM-MAR` identifica tanto **Sombra Líquida Matte Marrom** (linha 530) quanto **Sombra Líquida Cintilante Marrom** (linha 532). Ambas foram retidas. É necessário corrigir um dos códigos na fonte; não mesclamos variantes e não inventamos código comercial.

## Mapeamento seguro

| Origem | Destino |
| --- | --- |
| CÓDIGO, coluna D | ID estável e SKU |
| DESCRIÇÃO, coluna E | Nome do produto |
| MARCA, coluna B | Marca |
| LINHA, coluna C | Linha; agrupamento provisório da prévia |
| PREÇO PRATICADO, coluna M | Preço em centavos inteiros |
| Situação, coluna S | Elegibilidade para prévia; não representa estoque |
| Volume/unidade explícito na descrição | Embalagem exibida; não deduzida de sufixos do SKU |

PREÇO SUGERIDO, PREÇO CONSUMIDOR, MICRO DISTRIB., custos, margens, preço mínimo e dados financeiros de marketplace não foram incorporados ao payload público. O status financeiro da precificação não define disponibilidade do produto.

Todos os produtos da prévia estão **sob consulta**. A marcação Ativo no cadastro não é garantia de estoque. PREÇO PRATICADO é o campo proposto para o catálogo B2B e ainda requer revisão comercial antes do lançamento.

## Conteúdo pendente

Nenhum link de imagem foi encontrado nos registros da aba CATALOGO. A prévia exibe **Foto oficial pendente**, sem usar desenhos de embalagens como fotografia real. O acesso ao Meloja foi bloqueado pelo Cloudflare neste navegador; não foi possível conferir fotografias, textos técnicos e diferenças de cadastro entre as fontes.

As linhas foram preservadas e tiveram apenas espaços normalizados. Elas não foram apresentadas como taxonomia final de categorias. Produtos sem volume explícito e kits sem composição de embalagem permanecem na planilha de revisão.

## Reexecução

```bash
python3 scripts/import-fenie-sheet.py /caminho/fonte.xlsx /caminho/saida
npm run validate:catalog -- /caminho/saida/catalog-preview.json
python3 tests/import_fenie_sheet_test.py
```

O importador requer `openpyxl`, valida os cabeçalhos e usa uma lista explícita de campos comerciais. Produz `catalog-preview.json` e `catalog-review.json`; não publica nem altera a planilha. Manter o arquivo de precificação original fora do repositório público.

O laboratório foi atualizado com 414 registros comerciais em revisão e carrega inicialmente 24 cards, com busca sobre todos os itens. Envio de pedidos reais continua desativado. CMS e atualização dinâmica continuam no backlog; o snapshot da planilha não é sincronização automática.
