import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {validateCatalog} from '../public/catalogo-lab/core.mjs';

// Each source must belong to the manufacturer; its image may use its official CDN.
export const officialPhotoHosts = {
  RIGOLIM: {page: 'www.rigolim.com.br', image: 'images.tcdn.com.br'},
  PROHALL: {page: 'lojaprohall.com.br', image: 'cdn.shopify.com'},
  'MUP MAKEUP': {page: 'www.mupmakeup.com', image: 'www.mupmakeup.com'},
  OLENKA: {page: 'loja.olenkacosmeticos.com.br', image: 'loja.olenkacosmeticos.com.br'},
  DOHA: {page: 'loja.dohaprofessional.com', image: 'images.tcdn.com.br'},
};

function officialUrl(value, host) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== host || url.username || url.password || url.port) {
    throw new Error('URL fora da fonte oficial permitida');
  }
}

export function applyPhotos(catalog, manifest) {
  validateCatalog(catalog);
  if (!Array.isArray(manifest.photos) || !/^\d{4}-\d{2}-\d{2}$/.test(manifest.collectedAt ?? '')) {
    throw new Error('Manifesto de fotos inválido');
  }
  const result = structuredClone(catalog);
  const bySku = new Map(result.products.map(p => [p.sku.trim().toUpperCase(), p]));
  const withheld = new Set((manifest.withheld ?? []).map(p => p.sku.trim().toUpperCase()));
  const seen = new Set();
  for (const photo of manifest.photos) {
    const sku = String(photo.sku ?? '').trim().toUpperCase();
    const product = bySku.get(sku);
    if (!product || seen.has(sku) || withheld.has(sku)) throw new Error(`SKU ausente, duplicado ou retido: ${sku}`);
    seen.add(sku);
    if (product.brand !== photo.brand || product.name !== photo.mercosName) throw new Error(`Cadastro mudou: ${sku}`);
    const hosts = officialPhotoHosts[product.brand];
    if (!hosts) throw new Error(`Fabricante sem fonte conferida: ${sku}`);
    officialUrl(photo.page, hosts.page);
    officialUrl(photo.image, hosts.image);
    if (photo.catalogImage !== photo.image && photo.catalogImage !== `./assets/products/${photo.file}`) {
      throw new Error(`Referência de foto inválida: ${sku}`);
    }
    if (!/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.(jpg|png|webp)$/.test(photo.file) || !/^[a-f0-9]{64}$/.test(photo.sha256)) {
      throw new Error(`Arquivo ou checksum inválido: ${sku}`);
    }
    product.image = photo.catalogImage;
    product.imageAlt = `Foto da loja oficial ${product.brand}: ${product.name}; embalagem em conferência`;
    product.imageSource = photo.page;
    product.reviewPending = [...new Set([...(product.reviewPending ?? []).filter(p => p !== 'Foto oficial'), 'Embalagem da foto oficial'])];
  }
  for (const sku of withheld) {
    if (bySku.get(sku)?.image) throw new Error(`Produto retido ainda possui foto: ${sku}`);
  }
  const count = result.products.filter(p => p.image).length;
  result.summary = {...result.summary, officialImageCandidates: count, missingImages: result.products.length - count, photosUpdatedAt: manifest.collectedAt};
  return validateCatalog(result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [catalogPath, manifestPath, outputPath] = process.argv.slice(2);
    if (!catalogPath || !manifestPath || !outputPath) throw new Error('Uso: node scripts/import-catalog-photos.mjs catalogo.json fontes.json saida.json');
    const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const result = applyPhotos(catalog, manifest);
    await writeFile(outputPath, JSON.stringify(result, null, 2) + '\n');
    console.log(`${result.summary.officialImageCandidates} fotos candidatas; ${result.summary.missingImages} produtos sem foto. Preços e cadastros preservados.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
