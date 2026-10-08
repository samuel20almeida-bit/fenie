# CATÁLOGO FENIÉ PRO — V1

**Documento Funcional**  
**Versão:** 1.0  
**Data:** Outubro/2026  
**Status:** EM AVALIAÇÃO  
**Projeto:** CATÁLOGO FENIÉ PRO — V1

---

# 1. OBJETIVO DO PROJETO

Construir uma plataforma própria de catálogo B2B da Fenié Cosméticos para substituir o catálogo atual do Meloja.

A solução deverá permitir que um profissional:

**CATÁLOGO → PRODUTO → QUANTIDADE → CARRINHO → RESUMO → WHATSAPP**

A V1 não será um e-commerce completo.

Seu papel será tornar o processo de consulta de produtos e montagem de pedidos:

- mais rápido;
- mais simples;
- melhor no celular;
- visualmente alinhado à Fenié;
- menos dependente de plataformas externas;
- mais barato de manter;
- preparado para evoluções futuras.

---

# 2. RESULTADO ESPERADO

Ao acessar o catálogo, o cliente deverá conseguir encontrar um produto, consultar suas principais informações, escolher a quantidade, adicionar ao carrinho e enviar um pedido estruturado para o WhatsApp da Fenié sem precisar conversar item por item com o atendimento.

O catálogo deverá reduzir a seguinte fricção:

**Cliente:**  
“Quero esse, esse e aquele produto.”

**Atendimento:**  
“Qual tamanho?”  
“Quantas unidades?”  
“Qual produto exatamente?”  
“Pode me mandar a foto?”  
“Mais alguma coisa?”

Para:

**Cliente monta pedido → Fenié recebe pedido estruturado.**

A conclusão comercial continuará acontecendo pelo atendimento da Fenié.

---

# 3. PAPEL ESTRATÉGICO DA V1

O Catálogo Fenié PRO V1 deverá cumprir cinco funções principais:

1. **CONVENIÊNCIA**
   Facilitar a consulta e o pedido pelo profissional.

2. **PRODUTIVIDADE**
   Reduzir trabalho manual do atendimento interno.

3. **PADRONIZAÇÃO**
   Fazer com que os pedidos recebidos tenham produtos, quantidades e informações claras.

4. **ATIVO DIGITAL PRÓPRIO**
   Reduzir dependência do Meloja.

5. **BASE TECNOLÓGICA**
   Preparar terreno para futuras integrações com o Fenié Revenue OS.

---

# 4. PRINCÍPIOS DA V1

## 4.1 MOBILE FIRST

A principal experiência deverá ser projetada para smartphone.

O desktop será responsivo, mas não deverá determinar o desenho da interface.

---

## 4.2 RAPIDEZ

O cliente deve conseguir:

**abrir → localizar → adicionar → enviar**

com o menor número possível de passos.

Evitar:

- pop-ups desnecessários;
- cadastros durante a jornada;
- formulários longos;
- menus excessivos;
- animações pesadas;
- telas intermediárias sem função.

---

## 4.3 SIMPLICIDADE

Uma funcionalidade somente deverá entrar na V1 se ajudar diretamente o cliente a:

- encontrar;
- entender;
- escolher;
- quantificar;
- pedir.

---

## 4.4 MANUTENÇÃO SEM DESENVOLVEDOR

Produtos, preços, imagens, marcas e categorias deverão poder ser alterados através de uma fonte de dados administrável.

A implementação técnica dessa fonte será decidida na etapa de arquitetura.

O requisito funcional é:

> Alterações normais de catálogo não poderão depender de editar código ou realizar novo deploy manual.

---

# 5. PÚBLICO PRINCIPAL

Profissionais da beleza atendidos pela Fenié, principalmente:

- salões de beleza;
- cabeleireiros;
- coloristas;
- especialistas em loiros;
- especialistas em mechas;
- terapeutas capilares;
- maquiadores;
- profissionais que já compram da Fenié;
- novos profissionais conhecendo o portfólio.

---

# 6. O QUE ESTÁ DENTRO DA V1

## CATÁLOGO

- catálogo completo;
- marcas;
- categorias;
- busca;
- filtros essenciais;
- imagens;
- preços;
- página de produto.

## COMPRA

- quantidade;
- adicionar ao carrinho;
- alterar quantidade;
- excluir item;
- subtotal;
- resumo.

## CONVERSÃO

- geração automática da mensagem;
- envio para WhatsApp da Fenié.

## INFRAESTRUTURA FUNCIONAL

- fonte administrável de produtos;
- URLs individuais;
- dados básicos de analytics;
- captura de origem da visita;
- estrutura preparada para evolução.

---

# 7. FORA DA V1

Não desenvolver inicialmente:

- pagamento online;
- PIX automático;
- cartão;
- boleto;
- checkout financeiro;
- emissão fiscal;
- ERP;
- CRM;
- cálculo complexo de frete;
- integração automática de estoque;
- reserva de estoque;
- aplicativo Android/iOS;
- programa de fidelidade;
- pontos;
- cashback;
- favoritos;
- listas salvas;
- histórico de pedidos;
- recompra automática;
- área do cliente;
- preços personalizados;
- carteira do vendedor completa;
- cross-sell inteligente;
- recomendações por IA;
- Revenue OS integrado.

Esses itens pertencem ao roadmap posterior.

---

# 8. ARQUITETURA FUNCIONAL DE NAVEGAÇÃO

Estrutura principal:

**HOME / CATÁLOGO**

→ MARCA  
→ CATEGORIA  
→ BUSCA  
→ PRODUTO  
→ CARRINHO  
→ RESUMO  
→ WHATSAPP

O cliente nunca deverá ficar a mais de poucos toques do carrinho.

---

# 9. TELA 01 — HOME / CATÁLOGO

## Objetivo

Ser a entrada principal para descoberta e recompra.

## Elementos

### Cabeçalho

- logo Fenié PRO;
- campo de busca;
- ícone do carrinho;
- contador de itens.

### Destaque principal

Área simples para comunicação comercial.

Pode exibir:

- novidades;
- campanha vigente;
- categoria;
- marca;
- produto.

Não deverá dominar excessivamente a tela.

### Navegação por marcas

Cards/logos das principais marcas.

Exemplos:

- Olenka;
- MUP Color;
- MUP Makeup;
- Glynett;
- DO•HA;
- Spa do Fio;
- Papel para Mechas;
- demais marcas ativas.

### Navegação por categorias

Exemplos:

- Coloração;
- Oxidantes;
- Descoloração;
- Tratamento;
- Finalização;
- Terapia Capilar;
- Alisamento;
- Home Care;
- Maquiagem;
- Papel para Mechas.

A taxonomia definitiva será validada utilizando o cadastro real de produtos.

### Produtos

Seções possíveis:

- Mais procurados;
- Novidades;
- Destaques;
- Todos os produtos.

Os agrupamentos deverão ser configuráveis.

---

# 10. CARD DE PRODUTO

Cada produto deverá apresentar no mínimo:

- imagem principal;
- marca;
- nome;
- volume/tamanho;
- preço;
- botão de adicionar;
- acesso à página do produto.

Exemplo:

**OLENKA**

Web Mask  
500g

R$ XXX,XX

[-] 1 [+]

**Adicionar**

---

# 11. COMPORTAMENTO DO CARD

Ao tocar na imagem ou nome:

→ abrir página do produto.

Ao tocar em **Adicionar**:

→ adicionar uma unidade.

Após adicionar:

- confirmar visualmente;
- atualizar contador do carrinho;
- não retirar o usuário da página.

O cliente deverá poder continuar comprando.

---

# 12. TELA 02 — RESULTADOS DE BUSCA

## Campo de busca

Deverá pesquisar por:

- nome;
- marca;
- categoria;
- linha;
- SKU;
- termos adicionais cadastrados.

Exemplo:

Cliente digita:

**“web”**

Resultado:

Web Mask 500g.

Cliente digita:

**“oxidante”**

Resultado:

Oxidantes disponíveis no catálogo.

---

# 13. BUSCA SEM RESULTADO

Exibir:

**Não encontramos esse produto.**

E oferecer:

- limpar busca;
- voltar ao catálogo;
- falar com a Fenié pelo WhatsApp.

Não apresentar tela vazia.

---

# 14. TELA 03 — MARCA

URL exemplo:

`/marca/olenka`

Elementos:

- nome;
- logo;
- descrição curta opcional;
- categorias existentes dentro da marca;
- produtos.

Filtros poderão incluir:

- categoria;
- linha;
- ordenação.

---

# 15. TELA 04 — CATEGORIA

URL exemplo:

`/categoria/tratamento`

Elementos:

- nome da categoria;
- produtos;
- marcas existentes naquela categoria;
- filtros;
- ordenação.

---

# 16. FILTROS V1

Manter poucos filtros.

Prioridade:

- marca;
- categoria.

Opcional, caso o cadastro justifique:

- linha.

Evitar na V1:

- filtros técnicos excessivamente detalhados;
- dezenas de atributos;
- filtros pouco utilizados.

---

# 17. ORDENAÇÃO

Opções iniciais:

- Relevância;
- Nome A–Z;
- Menor preço;
- Maior preço.

A ordenação padrão poderá utilizar prioridade manual definida pela Fenié.

---

# 18. TELA 05 — PRODUTO

URL:

`/produto/[slug]`

Exemplo:

`/produto/web-mask-500g`

## Informações

### Obrigatórias

- imagem;
- marca;
- nome;
- tamanho/volume;
- preço;
- quantidade;
- botão adicionar ao carrinho.

### Recomendadas

- descrição curta;
- benefícios;
- indicação;
- modo de uso;
- linha;
- categoria.

### Opcionais

- galeria;
- vídeo;
- ficha técnica;
- selo;
- informação de uso profissional.

A ausência de um campo opcional não poderá quebrar o layout.

---

# 19. QUANTIDADE

Controle:

**[-] 1 [+]**

Regras V1:

- apenas número inteiro;
- mínimo padrão: 1;
- incremento padrão: 1;
- não permitir zero dentro do seletor;
- exclusão acontece pelo carrinho.

A estrutura de dados poderá permitir futuramente:

- quantidade mínima;
- múltiplos;
- caixa fechada.

Mas isso não será necessário para todos os SKUs na V1.

---

# 20. PRODUTOS E VARIAÇÕES

Para reduzir complexidade:

**Cada SKU será tratado como um produto independente na V1.**

Exemplo:

Produto A 250ml  
Produto A 500ml

podem ser dois registros.

Não será criado inicialmente um sistema avançado de:

- variantes;
- grades;
- combinações;
- opções dinâmicas.

Essa decisão reduz complexidade de cadastro, carrinho e manutenção.

---

# 21. ADICIONAR AO CARRINHO

Ao adicionar:

- produto entra no carrinho;
- quantidade escolhida é respeitada;
- se já existir, quantidade é somada;
- contador global é atualizado.

Feedback:

**Adicionado ao carrinho ✓**

Não abrir automaticamente a tela do carrinho após cada adição.

---

# 22. CARRINHO PERSISTENTE

O carrinho deverá permanecer salvo no navegador do cliente.

Caso ele:

- feche a página;
- navegue para outro produto;
- retorne posteriormente;

os itens ainda poderão permanecer disponíveis.

A duração técnica será definida posteriormente.

Não exige login.

---

# 23. TELA 06 — CARRINHO

Exibir para cada produto:

- imagem;
- nome;
- tamanho;
- preço unitário;
- quantidade;
- subtotal do item;
- remover.

Exemplo:

**Web Mask 500g**

R$ 100,00

[-] 2 [+]

Subtotal: R$ 200,00

---

# 24. RESUMO DO CARRINHO

Mostrar:

**Subtotal dos produtos: R$ X.XXX,XX**

Não calcular na V1:

- frete;
- desconto financeiro;
- comissão;
- condições especiais;
- imposto individual;
- promoções complexas.

Exibir aviso:

> Valores de frete, disponibilidade, condições comerciais e pagamento serão confirmados pela equipe Fenié no atendimento.

---

# 25. CARRINHO VAZIO

Exibir:

**Seu carrinho está vazio.**

CTA:

**Ver produtos**

Evitar página sem direcionamento.

---

# 26. TELA 07 — RESUMO DO PEDIDO

Última etapa antes do WhatsApp.

Exibir:

### Pedido

Produto A  
2 × R$ XX = R$ XX

Produto B  
4 × R$ XX = R$ XX

---

**Subtotal: R$ XXX**

Botão principal:

**Enviar pedido pelo WhatsApp**

Botão secundário:

**Continuar comprando**

---

# 27. IDENTIFICAÇÃO DO CLIENTE

Não exigir cadastro na V1.

Pode existir campo opcional:

**Nome / Salão**

O objetivo é aumentar a qualidade da mensagem sem criar barreira.

Não solicitar inicialmente:

- CPF;
- CNPJ;
- endereço completo;
- senha;
- e-mail;
- cadastro empresarial.

Essas informações serão tratadas posteriormente pelo atendimento quando necessário.

---

# 28. GERAÇÃO DA MENSAGEM DE WHATSAPP

Ao tocar em:

**Enviar pedido pelo WhatsApp**

o sistema deverá gerar automaticamente mensagem estruturada.

Formato sugerido:

Olá! Montei um pedido pelo Catálogo Fenié PRO.

**PEDIDO**

1. Web Mask 500g  
Quantidade: 2  
Unitário: R$ XX,XX  
Subtotal: R$ XXX,XX

2. Lipid Serum 100ml  
Quantidade: 1  
Unitário: R$ XX,XX  
Subtotal: R$ XX,XX

**Subtotal dos produtos:** R$ XXX,XX

Nome/Salão: [se informado]

Gostaria de confirmar disponibilidade, condições comerciais e entrega.

---

# 29. WHATSAPP

O número de destino deverá ser administrável.

Não poderá ficar espalhado diretamente pelo código da aplicação.

Configuração:

**WHATSAPP_PEDIDOS**

Permitirá trocar o destino futuramente sem reconstruir o site.

---

# 30. PEDIDO NÃO É VENDA CONFIRMADA

Regra importante:

O clique em WhatsApp significa:

**INTENÇÃO DE PEDIDO**

e não:

**PEDIDO FATURADO**

O catálogo não deverá informar:

- pagamento aprovado;
- pedido confirmado;
- venda concluída;
- estoque reservado.

A confirmação continuará sendo realizada pela equipe Fenié.

---

# 31. DISPONIBILIDADE / ESTOQUE

Não haverá sincronização de estoque na V1.

Cada produto poderá possuir um status simples:

**ATIVO**

produto disponível no catálogo.

**INDISPONÍVEL**

produto temporariamente não disponível.

**OCULTO**

não aparece para clientes.

Opcionalmente poderá existir:

**CONSULTE**

Produto permanece visível, mas exige confirmação.

---

# 32. PREÇOS

Cada produto possuirá:

- preço atual;
- preço anterior opcional.

Preço anterior deverá ser utilizado somente quando existir motivo comercial real.

Exemplo:

De R$ 120  
Por R$ 99

Não criar engine avançada de promoções na V1.

---

# 33. DECISÃO CRÍTICA — VISIBILIDADE DE PREÇOS

Existe uma decisão obrigatória antes do desenvolvimento.

A V1 foi definida sem login de clientes.

Portanto, existem duas alternativas principais:

### OPÇÃO A — PREÇOS PÚBLICOS

Qualquer visitante vê os preços.

**Benefícios**
- menor fricção;
- implementação mais simples;
- busca e compra mais rápidas.

**Risco**
- exposição dos preços profissionais.

### OPÇÃO B — PREÇOS PROTEGIDOS

Criar algum mecanismo de acesso.

Isso adiciona complexidade e começa a aproximar a V1 de uma área autenticada.

### RECOMENDAÇÃO FUNCIONAL

Não inserir uma autenticação improvisada apenas para esconder preços.

A decisão deverá ser tomada conscientemente antes da arquitetura técnica.

**STATUS: DECISÃO PENDENTE.**

---

# 34. CADASTRO DE PRODUTO — MODELO FUNCIONAL

Cada produto deverá possuir os seguintes campos.

## Identificação

- ID;
- SKU;
- nome;
- slug;
- marca;
- categoria;
- linha opcional.

## Comercial

- preço;
- preço anterior opcional;
- ativo;
- destaque;
- ordenação.

## Produto

- volume/tamanho;
- descrição curta;
- descrição completa;
- benefícios;
- indicação;
- modo de uso.

## Imagens

- imagem principal;
- galeria opcional;
- texto alternativo.

## Busca

- palavras-chave;
- termos alternativos.

## Sistema

- data de criação;
- data de atualização.

---

# 35. MARCA — MODELO DE DADOS

Campos:

- ID;
- nome;
- slug;
- logo;
- descrição;
- imagem opcional;
- ativa/inativa;
- ordem de exibição.

---

# 36. CATEGORIA — MODELO DE DADOS

Campos:

- ID;
- nome;
- slug;
- descrição opcional;
- imagem opcional;
- ativa/inativa;
- ordem.

A arquitetura poderá suportar categorias hierárquicas futuramente.

A V1 deverá evitar hierarquias excessivas.

---

# 37. METADADOS DE ORIGEM

O catálogo deverá reconhecer e preservar quando disponíveis:

- UTM source;
- UTM medium;
- UTM campaign;
- UTM content;
- vendedor;
- campanha.

Exemplo futuro:

`catalogo.fenie.com.br/?vendedor=daniele`

ou

`?utm_campaign=mup_outubro`

Essas informações poderão ser utilizadas em analytics e posteriormente pelo Revenue OS.

---

# 38. ATRIBUIÇÃO DE VENDEDOR

A arquitetura deverá permitir um identificador opcional de vendedor na URL.

Exemplo:

`?seller=daniele`

O identificador poderá permanecer durante a navegação.

Na V1 ele poderá ser utilizado apenas para:

- analytics;
- identificação da origem;
- inclusão opcional na mensagem.

Não haverá ainda:

- carteira do vendedor;
- comissão automática;
- login de representante;
- regras comerciais individualizadas.

---

# 39. ANALYTICS MÍNIMO

Eventos recomendados:

- catálogo visualizado;
- busca realizada;
- produto visualizado;
- produto adicionado;
- produto removido;
- carrinho visualizado;
- início do resumo;
- clique em WhatsApp.

Nome conceitual:

`view_catalog`

`search`

`view_item`

`add_to_cart`

`remove_from_cart`

`view_cart`

`begin_checkout`

`whatsapp_order_click`

Isso permitirá medir o funil:

**VISITA**
→ **PRODUTO**
→ **CARRINHO**
→ **WHATSAPP**

---

# 40. NÃO MEDIR CLIQUE COMO VENDA

A métrica:

**whatsapp_order_click**

não será considerada faturamento.

Ela representa intenção.

Posteriormente será possível cruzar esse comportamento com pedidos reais através do Revenue OS.

---

# 41. PERFORMANCE

A experiência deverá ser rápida mesmo em conexão móvel comum.

Diretrizes:

- imagens otimizadas;
- carregamento sob demanda;
- evitar bibliotecas pesadas;
- evitar vídeo automático pesado;
- evitar efeitos visuais que atrasem interação.

Meta técnica a detalhar na arquitetura:

**priorizar carregamento percebido abaixo de poucos segundos em mobile.**

---

# 42. RESPONSIVIDADE

Prioridade:

1. Smartphone.
2. Tablet.
3. Desktop.

Itens obrigatórios no mobile:

- busca facilmente acessível;
- botões grandes;
- carrinho sempre acessível;
- quantidade fácil de alterar;
- textos legíveis;
- sem necessidade de zoom.

---

# 43. ACESSIBILIDADE BÁSICA

A V1 deverá possuir:

- contraste adequado;
- textos alternativos em imagens;
- campos identificados;
- navegação por teclado em desktop;
- feedback de ações;
- botões com área de toque adequada.

---

# 44. ESTADOS DE INTERFACE

Devem existir estados explícitos para:

### Carregando

Skeleton ou carregamento visual leve.

### Erro

“Não foi possível carregar. Tente novamente.”

### Sem produto

Mensagem + retorno ao catálogo.

### Produto indisponível

Não permitir adicionar normalmente.

### Carrinho vazio

Direcionar ao catálogo.

### Busca vazia

Mostrar alternativas.

---

# 45. URLS

Estrutura sugerida:

`/`

`/catalogo`

`/marca/olenka`

`/marca/glynett`

`/categoria/coloracao`

`/categoria/tratamento`

`/produto/web-mask-500g`

`/carrinho`

`/pedido`

URLs deverão ser legíveis e estáveis.

---

# 46. SEO BÁSICO

Embora o objetivo principal seja venda B2B, a estrutura deverá permitir:

- title;
- meta description;
- Open Graph;
- URL amigável;
- sitemap;
- canonical;
- imagens sociais.

Não transformar SEO em um projeto paralelo antes de validar o catálogo.

---

# 47. MANUTENÇÃO DO CATÁLOGO

A equipe autorizada da Fenié deverá conseguir alterar sem código:

- nome;
- imagem;
- descrição;
- preço;
- marca;
- categoria;
- status;
- destaque;
- ordem.

O mecanismo exato será decidido na arquitetura.

Possibilidades poderão incluir:

- painel próprio;
- CMS;
- base estruturada externa;
- solução híbrida.

A escolha deverá privilegiar:

**SIMPLICIDADE + BAIXO CUSTO + FACILIDADE DE MANUTENÇÃO.**

---

# 48. O QUE NÃO PRECISA EXISTIR NO BACKOFFICE V1

Não é necessário inicialmente construir:

- dashboard financeiro;
- pedidos;
- CRM;
- clientes;
- comissão;
- estoque avançado;
- emissão fiscal;
- logística;
- gestão de vendedores;
- automações complexas.

O backoffice, se utilizado, existe principalmente para:

**MANTER O CATÁLOGO.**

---

# 49. SEGURANÇA FUNCIONAL

A plataforma deverá:

- impedir edição pública do catálogo;
- proteger credenciais administrativas;
- não expor chaves privadas;
- utilizar conexão HTTPS;
- validar dados utilizados nas URLs;
- não armazenar dados pessoais desnecessariamente.

---

# 50. FLUXO PRINCIPAL

### PASSO 1

Cliente acessa catálogo.

↓

### PASSO 2

Busca ou navega por marca/categoria.

↓

### PASSO 3

Abre produto.

↓

### PASSO 4

Escolhe quantidade.

↓

### PASSO 5

Adiciona ao carrinho.

↓

### PASSO 6

Continua comprando ou abre carrinho.

↓

### PASSO 7

Confere produtos e quantidades.

↓

### PASSO 8

Abre resumo.

↓

### PASSO 9

Toca em “Enviar pedido pelo WhatsApp”.

↓

### PASSO 10

WhatsApp abre com mensagem preenchida.

↓

### PASSO 11

Cliente envia.

↓

### PASSO 12

Equipe Fenié confirma:

- disponibilidade;
- condição comercial;
- entrega;
- pagamento.

---

# 51. FLUXO DE RECOMPRA

Cliente recorrente deverá conseguir fazer:

**ABRIR**
→ **BUSCAR PRODUTO**
→ **ADICIONAR**
→ **QUANTIDADE**
→ **WHATSAPP**

sem precisar navegar institucionalmente pelo site.

Isso deve influenciar fortemente a UX.

---

# 52. CRITÉRIOS DE ACEITE FUNCIONAL

A V1 somente estará funcionalmente pronta quando:

### CATÁLOGO

- marcas aparecem corretamente;
- categorias aparecem corretamente;
- produtos aparecem corretamente;
- busca funciona.

### PRODUTO

- página abre;
- imagem aparece;
- preço aparece conforme regra;
- quantidade funciona.

### CARRINHO

- adiciona;
- soma;
- reduz;
- remove;
- calcula subtotal;
- permanece durante navegação.

### WHATSAPP

- mensagem é gerada;
- produtos são listados;
- quantidades corretas;
- valores corretos;
- subtotal correto;
- link abre WhatsApp.

### MOBILE

- fluxo completo funciona em smartphone.

### MANUTENÇÃO

- produto e preço podem ser atualizados sem editar código.

---

# 53. TESTES FUNCIONAIS OBRIGATÓRIOS

Testar:

1 unidade de 1 produto.

10 unidades de 1 produto.

1 unidade de vários produtos.

alteração de quantidade.

remoção.

produto indisponível.

carrinho vazio.

busca encontrada.

busca não encontrada.

retorno ao catálogo.

fechar e reabrir navegador.

WhatsApp instalado.

WhatsApp Web.

Android.

iPhone.

desktop.

conexão móvel.

---

# 54. PILOTO

Antes de substituir completamente o Meloja:

### Grupo inicial

Sugestão:

20 a 50 clientes.

Perfil misto:

- recorrentes;
- clientes de várias marcas;
- compradores frequentes pelo WhatsApp;
- clientes com diferentes tickets.

### Período

7 a 14 dias.

### Medir

- acessos;
- buscas;
- produtos visualizados;
- adições ao carrinho;
- carrinhos;
- cliques no WhatsApp;
- problemas relatados;
- dúvidas;
- tempo percebido;
- pedidos efetivamente convertidos.

---

# 55. HIPÓTESE DO PILOTO

**HIPÓTESE**

Se oferecermos aos clientes profissionais um catálogo mobile simples onde conseguem montar seu próprio pedido e enviá-lo estruturado para o WhatsApp,

então reduziremos a fricção de compra e o trabalho operacional do atendimento

sem precisar implementar um e-commerce completo.

---

# 56. CRITÉRIO DE SUCESSO DO PILOTO

O piloto será considerado positivo se:

- clientes conseguirem concluir o fluxo sem orientação frequente;
- erros de pedido forem baixos;
- o atendimento perceber melhora na qualidade dos pedidos;
- houver utilização espontânea após o primeiro teste;
- não surgirem problemas críticos de preço, navegação ou catálogo.

O baseline numérico deverá ser medido no piloto antes da criação de metas rígidas.

---

# 57. CRITÉRIO DE INTERRUPÇÃO

Interromper ou corrigir antes da migração se houver:

- valores incorretos;
- produtos incorretos;
- pedidos gerados incorretamente;
- falhas críticas no mobile;
- carrinho inconsistente;
- WhatsApp gerando pedidos incompletos;
- manutenção de produtos excessivamente trabalhosa.

---

# 58. MIGRAÇÃO DO MELOJA

A migração não deverá ocorrer imediatamente após desenvolvimento.

Sequência:

**V1 PRONTA**
→ **TESTES INTERNOS**
→ **PILOTO**
→ **CORREÇÕES**
→ **APROVAÇÃO**
→ **MIGRAÇÃO**
→ **MONITORAMENTO**
→ **DESATIVAÇÃO DO MELOJA**

Durante uma fase curta, os dois catálogos poderão coexistir.

---

# 59. EVOLUÇÃO PREVISTA

A arquitetura deverá permitir posteriormente:

## V1.1

- melhorias de UX;
- novos filtros;
- campanhas;
- melhorias de busca;
- analytics avançado.

## V2

- login;
- identificação do cliente;
- preços personalizados;
- histórico;
- recompra.

## V3

- listas salvas;
- favoritos;
- cross-sell;
- sugestões de reposição.

## V4

- carteira do vendedor;
- regras comerciais;
- integração de dados.

## V5

- integração Fenié Revenue OS;
- Next Best Action;
- recomendações;
- automações comerciais.

Essa sequência não representa compromisso de desenvolvimento.

Cada versão deverá justificar seu valor antes de entrar em execução.

---

# 60. DECISÕES JÁ TOMADAS

**D01 — Plataforma própria**
APROVADO.

**D02 — Substituir Meloja**
APROVADO.

**D03 — Mobile first**
APROVADO.

**D04 — Pedido pelo WhatsApp**
APROVADO.

**D05 — Carrinho**
APROVADO.

**D06 — Pagamento online na V1**
NÃO INCLUIR.

**D07 — ERP próprio**
NÃO INCLUIR.

**D08 — CRM próprio**
NÃO INCLUIR.

**D09 — Login de clientes**
ADIAR.

**D10 — Revenue OS**
PREPARAR ARQUITETURA, NÃO INTEGRAR NA V1.

---

# 61. DECISÕES PENDENTES ANTES DO DESENVOLVIMENTO

## P01 — VISIBILIDADE DOS PREÇOS

Públicos ou protegidos?

**Prioridade: CRÍTICA.**

---

## P02 — NÚMERO OFICIAL DE WHATSAPP

Definir destino oficial de pedidos.

**Prioridade: ALTA.**

---

## P03 — FONTE DE DADOS DO CATÁLOGO

Definir na arquitetura:

- CMS;
- banco + painel;
- planilha estruturada;
- outra solução.

**Prioridade: ALTA.**

---

## P04 — TAXONOMIA OFICIAL

Validar:

- marcas;
- categorias;
- linhas.

**Prioridade: ALTA.**

---

## P05 — ATRIBUIÇÃO DE VENDEDOR

Definir se o parâmetro de vendedor deverá entrar já na V1 ou apenas ficar tecnicamente preparado.

**Recomendação: incluir na V1 por ser uma funcionalidade pequena e de alto valor futuro.**

---

# 62. PRINCÍPIO DE CONTROLE DE ESCOPO

Toda nova sugestão durante o desenvolvimento deverá responder:

**ESSA FUNCIONALIDADE É NECESSÁRIA PARA O CLIENTE ENCONTRAR, ESCOLHER, QUANTIFICAR OU ENVIAR O PEDIDO?**

Se não:

**BACKLOG V2.**

A V1 não deverá virar um e-commerce completo durante o desenvolvimento.

---

# 63. PRÓXIMA ETAPA DO PROJETO

Após aprovação deste Documento Funcional:

**ETAPA 2 — EXPERIÊNCIA**

Criar:

1. sitemap;
2. fluxograma da jornada;
3. wireframes mobile;
4. wireframes desktop;
5. sistema de navegação;
6. comportamento dos componentes;
7. estados de interface.

Somente depois:

**ETAPA 3 — ARQUITETURA TÉCNICA**

Definir:

- stack;
- frontend;
- backend;
- banco;
- CMS/admin;
- hospedagem;
- imagens;
- analytics;
- domínio;
- integração WhatsApp;
- modelo de deploy;
- segurança;
- custo mensal esperado.

---

# 64. DEFINIÇÃO DA V1

A definição mais simples do produto é:

> **O Catálogo Fenié PRO V1 é uma ferramenta B2B mobile que permite ao profissional encontrar produtos da Fenié, selecionar quantidades, montar um carrinho e enviar seu pedido estruturado pelo WhatsApp.**

Tudo que não fortalece diretamente essa proposta deverá, inicialmente, permanecer fora do escopo.