# Fotos fornecidas pela Fenié — Olenka

Em 08/10/2026 foram incorporados 18 arquivos originais da pasta compartilhada: 17 fotos individuais e uma foto do kit Men's Care, usada exclusivamente no SKU desse kit. A conferência cruzou SKU, marca, nome e volume com os 701 registros comerciais existentes e verificou visualmente as embalagens. A apresentação atual do estoque ainda requer confirmação da Fenié.

O manifesto `fotos-drive-olenka.json` registra origem, dimensões e SHA-256. Os arquivos são hospedados junto ao catálogo, sem depender de links de visualização do Drive. Os preços, nomes comerciais, volumes, SKUs e condições foram preservados integralmente. São 16 itens anteriormente sem foto e duas substituições: Royal Soft e condicionador Men's Care. O catálogo passa a ter 157 produtos com foto e 544 sem foto.

CC Cream e Royal Finish passam a integrar a vitrine Olenka, junto de Royal Soft, Royal Care, Royal Look e Hidra 3. A seleção é editorial, sem alegação de vendas ou rentabilidade. O índice da pasta cobre 627 produtos e não substitui a base Mercos. Fotos de linhas inteiras, volumes diferentes e SKUs divergentes foram retidas; shampoo e kit Royal Care ainda precisam de fotos individuais correspondentes.

Reimportação: `node scripts/import-supplied-photos.mjs public/catalogo-lab/catalog-preview.json docs/catalogo-v1/fotos-drive-olenka.json public/catalogo-lab/catalog-preview.json`.

Validação: `npm run test:catalog`, `npm run validate:catalog -- public/catalogo-lab/catalog-preview.json`, `npm run build`. Pedidos reais continuam desabilitados nesta prévia.
