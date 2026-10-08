import { cartSummary, quantity, MAX_QUANTITY } from './core.mjs';

// Curadoria explícita: tamanho de embalagem não define indicação ou revenda.
export const SALON_GROUPS = {
  profissional: { title: 'Olenka para os serviços do salão', description: 'Uma seleção para conhecer produtos de uso profissional. Confira a indicação e o protocolo com a Fenié.', skus: ['OLK-ALI-RLK-1000','OLK-ALI-RST-1000','OLK-KIT-HID3-3','OLK-COND-ESP-1.5','OLK-COND-MEN-1.5'] },
  bancada: { title: 'Olenka para sua bancada de revenda', description: 'Royal Care e Happy End: apresente os cuidados em casa de acordo com a avaliação do profissional. Escolha as quantidades para sua bancada.', skus: ['OLK-MSK-RYC-250','OLK-SH-RYC-250','OLK-KIT-RYC-2','OLK-FND-CCC-250'] },
};
const kitSource = 'https://loja.olenkacosmeticos.com.br/produto/kit-royal-care-sh-dual-mask-manutencao-250ml/';
const finishSource = 'https://loja.olenkacosmeticos.com.br/produto/kit-royal-care-sh-dual-mask-manutencao-cc-cream-leave-in-happy-end-250ml/';
export const SALON_CONTENT = [
  { sku:'OLK-MSK-RYC-250', brand:'OLENKA', mercosName:'Dual Mask Royal Care 250ml', displayName:'Royal Care · Dual Mask', summary:'Máscara da linha de manutenção para cabelos lisos naturais ou alisados.', indication:'Cabelos lisos naturais ou quimicamente alisados.', benefits:['Condicionamento dos fios','Maciez e cuidado no dia a dia'], howToUse:['Após lavar, distribuir do comprimento às pontas.','Para uso como máscara, deixar agir por 10 minutos e enxaguar.'], usageCompleteness:'steps', sourceUrl:'https://loja.olenkacosmeticos.com.br/produto/dual-mask-royal-care-manutencao-250ml/', sourceName:'Loja oficial Olenka', reviewedAt:'08/10/2026' },
  { sku:'OLK-SH-RYC-250', brand:'OLENKA', mercosName:'Shampooo Royal Care 250ml', displayName:'Royal Care · Shampoo', summary:'Shampoo para iniciar o cuidado de manutenção de cabelos lisos ou alisados.', indication:'Cabelos lisos naturais ou alisados.', benefits:['Limpeza na rotina de manutenção','Primeiro passo da linha Royal Care'], howToUse:['Massagear suavemente o couro cabeludo e enxaguar.','Continuar com a Dual Mask Royal Care conforme o rótulo.'], usageCompleteness:'steps', sourceUrl:kitSource, sourceName:'Loja oficial Olenka · linha Royal Care', reviewedAt:'08/10/2026' },
  { sku:'OLK-KIT-RYC-2', brand:'OLENKA', mercosName:'Kit Royal Care - Sh + Dual Mask', displayName:'Royal Care · Kit de manutenção', summary:'Shampoo e Dual Mask da mesma linha em um kit para o cuidado em casa.', indication:'Cabelos lisos naturais ou alisados.', benefits:['Limpeza e condicionamento na mesma linha','Opção de kit para a bancada'], howToUse:['Usar o shampoo e enxaguar.','Aplicar a máscara do comprimento às pontas; como máscara, pausar 10 minutos e enxaguar.'], usageCompleteness:'steps', sourceUrl:kitSource, sourceName:'Loja oficial Olenka', reviewedAt:'08/10/2026' },
  { sku:'OLK-FND-CCC-250', brand:'OLENKA', mercosName:'Cc Cream Leave - In Universal Happy End Olenka 250ml', displayName:'Happy End · CC Cream Leave-in', summary:'Finalizador sem enxágue para complementar a rotina de cuidados.', indication:'Finalização conforme a necessidade dos fios e a orientação profissional.', benefits:['Auxilia no controle do frizz','Proteção térmica na finalização'], howToUse:['Distribuir uma pequena quantidade nos cabelos úmidos, com auxílio de um pente, antes da escovação.','Seguir as orientações da embalagem.'], usageCompleteness:'overview', sourceUrl:finishSource, sourceName:'Loja oficial Olenka · Royal Care e Happy End', reviewedAt:'08/10/2026' },
];

const complements = {
  'OLK-MSK-RYC-250':['OLK-SH-RYC-250','OLK-FND-CCC-250'],
  'OLK-SH-RYC-250':['OLK-MSK-RYC-250','OLK-FND-CCC-250'],
  'OLK-KIT-RYC-2':['OLK-FND-CCC-250'],
  'OLK-FND-CCC-250':['OLK-KIT-RYC-2'],
};
export function validateSalon(products) {
  const bySku = new Map(products.map(p=>[p.sku,p]));
  for (const group of Object.values(SALON_GROUPS)) {
    if (new Set(group.skus).size !== group.skus.length || group.skus.some(sku=>!bySku.has(sku))) throw Error('Seleção do salão desatualizada');
  }
  const seen = new Set();
  for (const item of SALON_CONTENT) {
    const p = bySku.get(item.sku), url = new URL(item.sourceUrl);
    if (!p || p.name !== item.mercosName || p.brand !== item.brand || seen.has(item.sku) || url.protocol !== 'https:' || url.hostname !== 'loja.olenkacosmeticos.com.br') throw Error('Ficha do salão desatualizada');
    seen.add(item.sku);
  }
  for (const [sku, related] of Object.entries(complements)) {
    if (!seen.has(sku) || related.includes(sku) || related.some(s=>!seen.has(s))) throw Error('Complemento não conferido');
  }
  return SALON_CONTENT;
}
export function salonProducts(products, goal = '') {
  if (!goal) return products;
  const skus = new Set(SALON_GROUPS[goal]?.skus ?? []);
  return products.filter(p=>skus.has(p.sku));
}
export function complementaryProducts(products, sku) {
  const bySku = new Map(products.map(p=>[p.sku,p]));
  return (complements[sku] ?? []).map(s=>bySku.get(s)).filter(p=>p && !['hidden','unavailable'].includes(p.status));
}
// Validação atômica: nunca adicionar parte da lista, trocar SKU ou ultrapassar o limite.
export function mergeReplenishment(saved, current, products) {
  const summary = cartSummary(saved, products);
  if (!summary.items.length || summary.issues.length) throw Error('Revise os itens da lista antes de adicionar.');
  const merged = { ...current };
  for (const {product, quantity:count} of summary.items) {
    const total = (current[product.id] === undefined ? 0 : quantity(current[product.id])) + count;
    if (total > MAX_QUANTITY) throw Error('A soma com o pedido ultrapassa 999 unidades por produto.');
    merged[product.id] = quantity(total);
  }
  return merged;
}
