// Medição — briefing cap. 15.
//
// Os identificadores NÃO ficam no repositório: entram como variáveis de
// ambiente na Vercel (Settings → Environment Variables) com o prefixo
// PUBLIC_, que é o que o Astro expõe ao navegador. Enquanto estiverem
// vazios, os snippets simplesmente não são renderizados — o site vai ao ar
// sem nenhum script de terceiro, exatamente como está hoje. Assim que o ID
// aparece, a medição liga sozinha, sem tocar em código.
//
// Mesmo padrão que PUBLIC_WHATSAPP_NUMBER já usa em lib/whatsapp.ts.

/** ID do pixel da Meta (só dígitos). Ex.: 1234567890123456 */
export const META_PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID || "";

/** ID de medição do GA4, no formato G-XXXXXXXXXX. */
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID || "";

/** Há pelo menos um destino configurado? */
export const temDestino = Boolean(META_PIXEL_ID || GA4_ID);

// Os eventos do briefing cap. 15, num lugar só, para não virarem string
// solta espalhada pelos componentes. O valor é o nome que chega no GA4.
export const EVENTOS = {
  cliqueWhatsapp: "clique_whatsapp",
  cliqueCatalogo: "clique_catalogo",
  cadastroProfissional: "cadastro_profissional",
  verCurso: "ver_curso",
  inscricaoCurso: "inscricao_curso",
  cliqueMarca: "clique_marca",
  escolhaCaminho: "escolha_caminho",
  scroll: "scroll_profundidade",
} as const;
