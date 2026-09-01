// Webhook público do agente de tira-dúvidas (n8n) — sem credencial exigida,
// protegido por limite diário de 8 perguntas por sessão no próprio workflow.
//
// A URL é /webhook/<path>, SEM o id do webhook no caminho. A forma
// /webhook/<webhookId>/<path> — que a API do n8n reporta como "Production
// URL" — devolve 500 e, por ser erro do roteador, vem sem os cabeçalhos de
// CORS: o navegador barra o pedido no preflight e o n8n nunca registra
// execução nenhuma. Foi exatamente essa a falha em produção.
// Mesmo padrão do WHATSAPP_NUMBER: valor real como default, PUBLIC_ só para
// apontar a um ambiente diferente (staging, teste).
export const ASSISTANT_URL =
  import.meta.env.PUBLIC_ASSISTENTE_URL ||
  "https://n8n-m5uf.srv1833354.hstgr.cloud/webhook/popup-agente-ia-fenie";
