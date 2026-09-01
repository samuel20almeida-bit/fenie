// Webhook público do agente de tira-dúvidas (n8n) — sem credencial exigida,
// protegido por limite diário de 8 perguntas por sessão no próprio workflow.
// Mesmo padrão do WHATSAPP_NUMBER: valor real como default, PUBLIC_ só para
// apontar a um ambiente diferente (staging, teste).
export const ASSISTANT_URL =
  import.meta.env.PUBLIC_ASSISTENTE_URL ||
  "https://n8n-m5uf.srv1833354.hstgr.cloud/webhook/e370460c-f08a-47fc-86db-cec5d9977d74/popup-agente-ia-fenie";
