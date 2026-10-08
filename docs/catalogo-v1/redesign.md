# Vitrine de revisão — 07/10/2026

A prévia usa a identidade do HTML institucional fornecido por Samuel: azul #07131f, dourado #c9a667, creme #f5f1e8, títulos serifados e a imagem do salão em um banner compacto. A fotografia do banner foi extraída do arquivo enviado; não representa embalagem de produto. O HTML original, identificadores de analytics e conteúdo institucional completo não foram incorporados ao catálogo.

## Comportamento

- Busca no cabeçalho disponível em todas as telas.
- Atalhos para as dez marcas da base e categorias provisórias por tipo de produto.
- Categorias são agrupamentos de apresentação em revisão. Não alteram marca, linha, SKU, preço ou quantidade da fonte. Produtos ambíguos ficam em Outros.
- Filtros de marca, categoria, linha e ordenação. A lista de linhas acompanha marca, categoria e busca; seleções de linha incompatíveis são limpas.
- Grade responsiva, 24 cards por página e botão para mostrar mais.
- Fotos oficiais continuam marcadas como pendentes, com apresentação neutra da marca e embalagem.
- Quantidades podem ser digitadas ou ajustadas pelos botões; inteiros de 1 a 999.
- Barra fixa de pedido com quantidade e subtotal, acima da navegação inferior no celular.
- Produto, carrinho e resumo usam a mesma identidade; o carrinho mantém sua chave e persistência existentes.

## Limites comerciais

Os 414 produtos e preços permanecem em revisão. Disponibilidade é sob consulta. Categorias precisam de conferência pela Fenié; nomes e embalagens ainda refletem a planilha. Envio de pedidos reais permanece desativado, e mensagens são identificadas como demonstração. Não foram inventados benefícios, modo de uso, promoções ou rankings de venda.

Fotos oficiais, revisão de cadastro/preços, número de pedidos e administração sem código continuam pendentes antes do piloto. Os links comerciais do institucional não foram alterados.

## Validação

Executar `npm run test:catalog`, `npm run validate:catalog -- public/catalogo-lab/catalog-preview.json`, `python3 tests/import_fenie_sheet_test.py` e `npm run build`. Os testes de navegação verificam preservação dos SKUs e preços, categorias exclusivas, precedência do tipo do produto e composição de filtros.
