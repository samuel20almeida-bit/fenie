# Cadastro e migração do Meloja

## Fonte e responsabilidade

Exportação do Meloja é a fonte inicial escolhida por Samuel. A Fenié revisa informações comerciais; desenvolvimento importa e verifica estrutura. Não afirmar integração automática sem comprovar os recursos de exportação do Meloja.

O arquivo `modelo-produtos.csv` usa UTF-8 e separador `;`. Cada linha será um SKU. Não inserir os preços ilustrativos do protótipo no cadastro comercial.

| Campo na coleta | Obrigatório para publicação | Regra |
| --- | --- | --- |
| `sku` | Sim | Identificador comercial único; preservar o do sistema atual quando existir |
| `slug` | Sim | Único, minúsculo, sem acentos, palavras separadas por hífen |
| `nome` | Sim | Nome comercial fiel à embalagem/cadastro |
| `marca`, `categoria` | Sim | Nomes normalizados, sem duplicações por grafia |
| `linha` | Não | Ajuda na busca; não inventar linha |
| `tamanho` | Sim | Volume/peso/unidade; separar embalagem por SKU |
| `preco_brl` | Sim | Preço atual aprovado pela Fenié, decimal com vírgula; converter para centavos inteiros |
| `status` | Sim | `active`, `unavailable`, `hidden` ou `consult` |
| `destaque`, `ordem` | Não | Destaque verdadeiro e prioridade manual; ordem inteira |
| `imagem_url`, `imagem_alt` | Sim | Foto oficial do SKU, URL HTTPS acessível, descrição alternativa |
| `descricao`, `beneficios`, `indicacao`, `modo_uso` | Não | Informação oficial do fabricante, sem alegações inventadas |
| `palavras_chave` | Não | Termos separados por `\|`, incluindo nomes usados pelos clientes |

O validador técnico aceita imagens ausentes para o laboratório. A revisão de publicação exige imagem oficial. Descrições e benefícios dos seis produtos de demonstração são exemplos de experiência, não dados aprovados.

## Processo de importação

1. Obter exportação e anotar data/origem; manter uma cópia original sem alterações.
2. Contar SKUs, mapear colunas e identificar preços que exigem revisão. Não deduzir SKU a partir de posição na planilha.
3. Detectar SKU/slug repetido, volume ausente, preço vazio/negativo, links inválidos e referências de marca/categoria não reconhecidas.
4. Padronizar marcas, categorias e linhas com o comercial. As categorias citadas no documento são propostas; a taxonomia final depende dos produtos reais.
5. Converter para o formato técnico: `id`, `sku`, `slug`, `name`, `brand`, `category`, `size`, `priceCents`, `status`, e opcionais. O ID deve permanecer estável entre importações.
6. Validar com `npm run validate:catalog -- caminho/catalogo.json`. O comando apenas lê/verifica; não publica e não altera arquivos.
7. Importar primeiro no ambiente de teste do CMS. Comparar contagens e revisar todos os preços e itens de maior risco, como nuances e volumes semelhantes.
8. A Fenié aprova o cadastro antes de habilitar mensagens reais.

Um preço zero passa na validação estrutural, mas precisa de revisão comercial explícita. Não interpretar campo vazio como zero. Produtos `consult` ainda têm preço na V1; disponibilidade será confirmada no atendimento.

## Rotina de operação proposta

| Atividade | Responsável a definir | Quando |
| --- | --- | --- |
| Revisar e publicar preço | Responsável do catálogo | Toda alteração comercial |
| Ocultar/desativar produto | Catálogo + comercial | Sempre que houver mudança relevante |
| Manter destino de pedidos | Gestor comercial | Quando trocar atendimento |
| Responder intenção de pedido | Equipe de WhatsApp | Na rotina comercial |
| Acompanhar incidentes | Desenvolvimento + comercial | Durante piloto e após lançamento |

Status no catálogo é uma informação editorial; não é promessa de estoque nem reserva. O atendimento continua validando disponibilidade.
