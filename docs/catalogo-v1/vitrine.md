# Vitrine, fichas e identidade — 07/10/2026

A nova etapa acrescenta três seleções editoriais e seis destaques à entrada do catálogo. Tratamento e cuidado reúne 12 produtos Prohall; finalização e penteados, seis Rigolim; maquiagem profissional, seis MUP Makeup. A seleção considera a disponibilidade de fotos candidatas e de informações oficiais suficientes. Não representa ranking de vendas, estoque ou promoção. O catálogo completo continua acessível com os 701 produtos e os mesmos preços padrão Mercos.

`public/catalogo-lab/editorial.json` contém 24 fichas, títulos curtos para os cards, resumos, indicação, três benefícios e orientação de uso. As fontes são as páginas oficiais registradas por SKU, conferidas em 07/10/2026. O conteúdo foi resumido e revisado, sem copiar preços dos fabricantes, promessas clínicas ou resultados garantidos. Nos quatro cosméticos MUP cuja página não detalha técnica ou quantidade de aplicação, a orientação é identificada como resumo; quando necessário, orienta consultar o rótulo. As embalagens não foram preenchidas a partir dessas descrições.

O módulo `merchandising.mjs` valida a identidade Mercos, fontes oficiais e referências antes de permitir a apresentação editorial. Campos de preço ou status comercial não são permitidos no conteúdo. O catálogo comercial e suas marcações de revisão permanecem intactos. Se a camada editorial falhar ao carregar ou estiver desatualizada, a vitrine básica continua funcionando. Filtros de seleção compõem com marca, categoria, grupo, busca e ordenação. Benefícios revisados também podem ser encontrados na busca, sem modificar os registros comerciais.

As fotografias podem ser ampliadas na ficha de qualquer produto com imagem. O modal nativo contém identificação, texto alternativo, fechamento por botão ou Escape, ampliação de 2× e rolagem para os detalhes. Ao fechar, o foco retorna ao botão da ficha. A ampliação usa o mesmo arquivo disponível; não é uma versão retocada nem uma garantia de maior resolução. Falha de imagem é tratada no modal.

A logo enviada por Samuel foi copiada, sem alteração dos bytes, para `public/catalogo-lab/assets/fenie-logo-original.png`. É aplicada no cabeçalho e no rodapé sobre fundo claro para preservar a leitura da versão preta transparente. O institucional fora de `/catalogo-lab/` não foi redesenhado nesta etapa.

## Verificação

23 testes Node passaram, incluindo integridade das 24 fichas, filtros combinados, busca por benefícios, fontes oficiais, prevenção de preço editorial e resumo do carrinho. Validador, sintaxe JavaScript, compilação Astro e `git diff --check` passaram. A logo mantém o SHA-256 do arquivo enviado; o snapshot comercial é idêntico ao publicado na etapa de fotos. Conferência no navegador desktop após o deploy: logo e três seleções visíveis; seleção de tratamentos com 12 produtos; ficha Biomask com preço de R$ 89,90, indicação, benefícios e modo de uso; foto carregada, ampliação 2×, Escape e retorno do foco; quantidade sincronizada entre destaque e catálogo; carrinho com duas Biomask e três Volumizer, subtotal de R$ 515,80; mensagem de demonstração com nomes e SKUs Mercos preservados. A validação em dispositivos móveis reais ainda está pendente.

Pedidos reais permanecem desativados. Fotos e embalagens ainda precisam da conferência comercial da Fenié.
