# Backlog da V1

Status `base` indica preparação nesta entrega. Só marcar `pronto` após verificar o comportamento com os dados reais.

| ID | Prioridade | Entrega | Aceite | Status / dependência |
| --- | --- | --- | --- | --- |
| CAT-01 | P0 | Saneamento Meloja | SKU único, preço revisado, marca/categoria/volume e foto por SKU | Aguarda exportação |
| CAT-02 | P0 | CMS | Editor autorizado altera produto, imagem, status, marca e preço sem código; visitante não edita | Arquitetura proposta |
| CAT-03 | P0 | Leitura dinâmica | Alteração publicada aparece sem deploy; falha de consulta exibe erro com nova tentativa | A implementar |
| CAT-04 | P0 | Catálogo responsivo | Todos os SKUs ativos/consulte visíveis; ocultos ausentes; indisponíveis sem adição | Base no laboratório |
| CAT-05 | P0 | Busca e filtros | Nome, SKU, linha, marca, categoria e termos; marca + categoria combináveis; sem resultado tem saída | Base no laboratório |
| CAT-06 | P0 | Página por SKU | URL direta abre produto correto; campos opcionais ausentes não quebram; inexistente retorna 404 | Hash no laboratório; rota real pendente |
| CAT-07 | P0 | Carrinho | Soma, altera, remove, calcula em centavos; restaura após reabrir; dados corrompidos não quebram | Base e testes |
| CAT-08 | P0 | Revisão comercial | Resumo reconsulta preço/status; mudança exige revisão; indisponibilidade bloqueia envio | Validação local pronta; servidor pendente |
| CAT-09 | P0 | WhatsApp | Destino único administrável; mensagem contém SKU, marca, tamanho, quantidades e valores corretos | Gerador testado; envio real desativado |
| CAT-10 | P0 | Administração e conteúdo | Credenciais privadas protegidas, consultas sem rascunhos, acesso de editor testado | Depende do CMS |
| CAT-11 | P1 | Marcas e categorias | URLs compartilháveis e filtros válidos dentro da seleção | A implementar |
| CAT-12 | P1 | Origem | Vendedor/UTMs mantidos ao navegar e no resumo; sem alterar condição comercial | Base e testes |
| CAT-13 | P1 | Eventos | Funil chega ao destino configurado, sem dados pessoais; clique não é faturamento | A implementar |
| CAT-14 | P1 | Imagens e acessibilidade | Fotos oficiais otimizadas; alt; teclado; foco; áreas de toque; sem overflow a 360px | Imagens reais pendentes; lab preparado |
| CAT-15 | P0 | Testes e piloto | Fluxo Android/iPhone/desktop passa; piloto acompanhado por comercial | Ver `piloto.md` |
| CAT-16 | P0 | Migração | Aprovação da Fenié; links revisados; catálogo anterior disponível para retorno | Após piloto |

## Ordem da próxima implementação

CAT-01 + CAT-02 → CAT-03 → CAT-04/05/06 → CAT-07/08/09 → CAT-10/11/12/13/14 → CAT-15 → CAT-16.

## Fora desta versão

ERP, PDV, pagamento online, sincronização/reserva de estoque, CRM, carteira de vendedor, comissão, login de cliente, preços personalizados, IA, fidelidade, favoritos e histórico. Uma sugestão nova só entra na V1 se for necessária para encontrar, entender, escolher, quantificar ou pedir.

## Definição de pronto

Código revisado; cadastro real aprovado; fluxos essenciais testados; preço e status revalidados antes do envio; número de pedidos confirmado; equipe consegue editar produto sem desenvolvedor; preview validado no celular; limites de analytics documentados; piloto aprovado. Um build passando sozinho não caracteriza catálogo pronto para venda.
