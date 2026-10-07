import { normalize, searchProducts } from './core.mjs';

export const CATEGORIES = [
  { id: 'coloracao', name: 'Coloração', short: 'Cor', icon: 'color' },
  { id: 'oxidantes', name: 'Oxidantes', short: 'Oxidantes', icon: 'drop' },
  { id: 'descoloracao', name: 'Descoloração', short: 'Mechas', icon: 'spark' },
  { id: 'tratamento', name: 'Tratamento e limpeza', short: 'Tratamento', icon: 'bottle' },
  { id: 'finalizacao', name: 'Finalização', short: 'Finalização', icon: 'wave' },
  { id: 'matizacao', name: 'Matização', short: 'Matização', icon: 'color' },
  { id: 'transformacao', name: 'Alisamento e relaxamento', short: 'Alisamento', icon: 'wave' },
  { id: 'maquiagem', name: 'Maquiagem', short: 'Makeup', icon: 'brush' },
  { id: 'acessorios', name: 'Acessórios e papel', short: 'Acessórios', icon: 'sheets' },
  { id: 'educacao', name: 'Cursos e educação', short: 'Educação', icon: 'sheets' },
  { id: 'outros', name: 'Outros produtos', short: 'Outros', icon: 'grid' },
];

// Presentation-only draft grouping. Source line, SKU and all commercial data stay intact.
// Prefer an explicit product type over the name of a multi-product line.
export function categoryFor(product) {
  const name = normalize(product.name);
  const group = normalize(product.sourceGroup);
  if (group === 'cursos') return 'educacao';
  if (group === 'acessorios' || group === 'papel para mechas') return 'acessorios';
  if (/papel para mechas|clipe|grampo|luva|filtro de cafe/.test(name)) return 'acessorios';
  if (/bruma fixadora|sombra|batom|blush|maquiagem|mascara de cilios|delineador|corretivo|base facial|po facial/.test(name) || product.brand === 'MUP MAKEUP') return 'maquiagem';
  if (/descolor|po para mechas/.test(name)) return 'descoloracao';
  if (/\box\b|oxidante|agua oxigenada|creme ativador hidratante/.test(name)) return 'oxidantes';
  if (/matiz|olenkolor/.test(name)) return 'matizacao';
  if (/coloracao|tintura/.test(name)) return 'coloracao';
  if (/alisante|progressiva|realinhamento|relaxer|redutor de volume|btx|thioglycolate|reducter/.test(name)) return 'transformacao';
  if (/finalizador|leave.?in|creme para pentear|ativador.*(?:cacho|my curly)|geleia|mousse|fixador|spray.*brilho|cera|pomada|texturizador|snow|protetor termico|acelerador de escova|silicone/.test(name)) return 'finalizacao';
  if (/shampoo|shampooing|condicion|conditioner|mascara|masque|mask|baume|balm|reconstru|nutri|hidrat|ampola|serum|acidifica/.test(name)) return 'tratamento';
  return 'outros';
}

export function navigateProducts(products, { category = '', line = '', ...filters } = {}) {
  return searchProducts(products, { ...filters, category: line }).filter(p => !category || categoryFor(p) === category);
}

export function availableLines(products, { query = '', brand = '', category = '' } = {}) {
  return [...new Set(navigateProducts(products, { query, brand, category }).map(p => p.line))].sort((a,b) => a.localeCompare(b, 'pt-BR'));
}
