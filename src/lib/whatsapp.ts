// Contexto no clique (briefing cap. 04): cada CTA abre a conversa já
// mencionando a marca, o curso ou a região — nunca um número solto.
// Formato E.164 sem "+": 55 (BR) + 41 (DDD) + 998402800 (celular com o 9).
export const WHATSAPP_NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER || "5541998402800";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
