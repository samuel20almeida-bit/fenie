# Atualização Mercos — 07/10/2026

A extração Mercos substitui a planilha anterior como fonte de nomes, códigos e preços. Samuel confirmou o uso da tabela padrão: coluna **Preço de Tabela**, sem fallback para preço mínimo, atacado, consumidor final ou Micro. Valores são armazenados em centavos.

Dos 804 registros, 701 estão ativos, exibidos e possuem código único. Os 103 restantes não entram na prévia: incluem cadastros inativos, ocultos, duplicados e sem código. A duplicidade é verificada em toda a exportação, inclusive em registros inativos. Não se escolhe arbitrariamente uma das linhas duplicadas.

Dos 414 produtos anteriores, 272 continuam na prévia com nomes e preços Mercos; 96 preços mudaram. Há 429 produtos novos. Os 142 anteriores sem correspondência elegível saem da vitrine, sem conclusão de que foram descontinuados. IDs e URLs dos produtos mantidos são preservados. O carrinho utiliza os preços atuais e impede gerar uma mensagem quando contém produtos removidos, exigindo a remoção desses itens.

A categoria principal do Mercos inclui marcas e grupos. Cursos, acessórios, papel e combos não são tratados como fabricantes. Quando possível, uma marca explicitamente cadastrada na base anterior é preservada se o grupo Mercos estiver vazio. Outras marcas e embalagens ausentes ficam identificadas para conferência. O filtro Grupo de produtos usa a subcategoria Mercos; as categorias visuais continuam provisórias. Descrições não são importadas automaticamente: a exportação contém inconsistências de conteúdo.

Cinco fotos da loja oficial Rigolim foram adicionadas como candidatas, sem edição, com fonte em `imageSource`, texto alternativo e identificação de embalagem em conferência. Em falha de imagem, a vitrine retorna ao marcador de foto pendente. A coleção está em `public/catalogo-lab/assets/products/`, com nomes por SKU.

O Excel original, a comparação completa, estoque, comissões, preços mínimos e tabelas alternativas ficam fora do repositório e do payload público. A prévia continua sem pedidos reais.

## Importação

`python3 scripts/import-mercos.py /caminho/exportacao.xlsx /caminho/catalogo-anterior.json public/catalogo-lab/catalog-preview.json`

O importador lê `Planilha1`, valida os cabeçalhos e utiliza somente campos comerciais permitidos. A reconciliação local é gravada ao lado da fonte privada. Fotografias existentes no catálogo anterior são preservadas como candidatas. Para adicionar novas fotos, conferir o SKU, copiar o original para a pasta de produtos e registrar imagem, texto alternativo e página de origem no cadastro.

## Validação

`npm run test:catalog`, `python3 tests/import_mercos_test.py`, `python3 tests/import_fenie_sheet_test.py`, `npm run validate:catalog -- public/catalogo-lab/catalog-preview.json` e `npm run build`.

Conferência independente realizada com o Excel original: os 701 nomes e preços correspondem à extração; os cinco arquivos de fotos mantêm o SHA-256 da coleta. Estoque no Mercos não confirma disponibilidade para venda na prévia.
