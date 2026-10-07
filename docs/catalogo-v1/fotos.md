# Fotos oficiais — 07/10/2026

A prévia tem **141 produtos com foto candidata**, de 701 produtos elegíveis. Foram acrescentadas 136 imagens às cinco fotos Rigolim existentes. A identidade, a apresentação e, quando informada, a quantidade foram comparadas com as páginas e fotografias das lojas oficiais. A Fenié ainda deve confirmar que comercializa a embalagem fotografada. Nenhum preço do fabricante foi importado: os preços continuam sendo os da tabela padrão Mercos.

| Marca | Produtos com foto | Produtos no catálogo |
| --- | ---: | ---: |
| Prohall | 60 | 66 |
| MUP Makeup | 56 | 60 |
| Rigolim | 16 | 18 |
| Olenka | 6 | 96 |
| Doha | 3 | 85 |
| Glynett | 0 | 91 |
| Spa do Fio | 0 | 93 |
| MUP Color | 0 | 81 |
| Marca a confirmar | 0 | 111 |
| **Total** | **141** | **701** |

## Correspondências retidas

As fotos de Extreme Repair foram excluídas: `PHL-MSK-EXT-500` está cadastrado como 500 g, mas o rótulo da foto mostra 450 g; `PHL-MSK-EXT-300` está cadastrado como 300 g, mas a foto mostra 250 g. O título da página do fabricante não substitui a conferência do rótulo.

Outros casos sem correspondência segura incluem Bio Mask 300 ml versus foto de 300 g, Rigolim Fix 2 em 1 versus outra versão do fabricante, Cera Spray sem identificação suficiente, batom Nude sem tonalidade inequívoca, demaquilante sem volume confirmado e nécessaires com tamanho sem correspondência. Itens excluídos por SKU duplicado na exportação Mercos não recebem fotos.

O lote ainda não cobre Glynett, Spa do Fio e MUP Color. Houve indisponibilidade nas consultas públicas e/ou falta de fotos individuais inequívocas. Na Olenka, apenas seis correspondências foram confirmadas com as páginas acessíveis. Os 111 produtos com marca a confirmar precisam de identificação. Esses obstáculos não indicam que os produtos foram descontinuados.

## Fontes e atualização

`fontes-fotos.json` registra SKU, nome Mercos, produto de origem, página oficial, URL da imagem, arquivo, data e SHA-256. As imagens foram mantidas sem edição. Cada variação MUP Makeup usa seu próprio arquivo oficial; tons semelhantes não são reaproveitados entre SKUs.

As cinco imagens anteriores estão em `public/catalogo-lab/assets/products/`. As 136 novas imagens são carregadas das lojas oficiais ou de seus CDNs. A prévia depende da disponibilidade desses endereços externos; uma falha retorna ao marcador de foto pendente. O pacote de entrega contém uma cópia dos 141 arquivos por SKU para futura hospedagem própria, fontes e a lista de 560 pendências. Não contém estoque, comissões ou preços alternativos.

Para aplicar um manifesto já conferido:

```sh
node scripts/import-catalog-photos.mjs public/catalogo-lab/catalog-preview.json docs/catalogo-v1/fontes-fotos.json public/catalogo-lab/catalog-preview.json
```

O importador valida a marca, o nome Mercos, o SKU único e os domínios oficiais antes de escrever. Só altera referências de imagem, texto alternativo, fonte e marcações de revisão. Não altera identificação, preço, nome, marca, embalagem, ordenação ou status comercial. SKUs retidos não podem receber foto por esse manifesto.

## Verificação

Os 141 arquivos foram decodificados e conferidos visualmente. Os checksums identificam exatamente os bytes coletados, sem recorte, retoque ou reconstrução de rótulos. A comparação antes/depois confirmou todos os campos comerciais dos 701 produtos. Os 19 testes do catálogo cobrem importação, fontes oficiais, tonalidades distintas, versões retidas e carrinho. A compilação e a validação estrutural passam. A renderização do site no navegador ainda exige conferência; o navegador automatizado não estava disponível nesta execução.

A prévia permanece em revisão, com pedidos reais desativados.
