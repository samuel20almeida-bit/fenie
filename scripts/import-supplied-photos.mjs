import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {validateCatalog} from '../public/catalogo-lab/core.mjs';

export function applySuppliedPhotos(catalog, manifest) {
  validateCatalog(catalog);
  if (manifest.version !== 1 || !Array.isArray(manifest.photos) || !/^\d{4}-\d{2}-\d{2}$/.test(manifest.collectedAt ?? '')) throw Error('Manifesto inválido');
  const result = structuredClone(catalog), seen = new Set();
  const bySku = new Map(result.products.map(p => [p.sku, p]));
  const withheld = new Set((manifest.withheld ?? []).map(p => p.sku));
  for (const photo of manifest.photos) {
    const p = bySku.get(photo.sku);
    if (!p || seen.has(photo.sku) || withheld.has(photo.sku)) throw Error('SKU ausente, duplicado ou retido');
    if (p.brand !== photo.brand || p.name !== photo.mercosName || p.size !== photo.size) throw Error('Identidade comercial divergente');
    if (photo.review !== 'sku-name-volume-visual' || !['individual','kit'].includes(photo.kind)) throw Error('Foto sem conferência individual');
    const source = new URL(photo.page);
    if (source.origin !== 'https://drive.google.com' || source.username || source.password || !/^\/file\/d\/[A-Za-z0-9_-]+\/view$/.test(source.pathname)) throw Error('Origem inválida');
    if (!/^[A-Za-z0-9_-]+\.(png|webp|jpg)$/.test(photo.file) || photo.catalogImage !== `./assets/products/${photo.file}` || !/^[a-f0-9]{64}$/.test(photo.sha256)) throw Error('Arquivo inválido');
    seen.add(photo.sku);
    p.image = photo.catalogImage;
    p.imageAlt = `${p.brand} — ${p.name}; foto fornecida pela Fenié`;
    p.imageSource = photo.page;
    p.reviewPending = [...new Set([...(p.reviewPending ?? []).filter(x => !['Foto oficial','Embalagem da foto oficial'].includes(x)), 'Embalagem atual a confirmar'])];
  }
  const count = result.products.filter(p => p.image).length;
  result.summary = {...result.summary, imageCandidates:count, suppliedImageCandidates:manifest.photos.length, officialImageCandidates:result.products.filter(p => p.image && !p.imageSource?.startsWith('https://drive.google.com/')).length, missingImages:result.products.length-count, photosUpdatedAt:manifest.collectedAt};
  return validateCatalog(result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [catalogPath, manifestPath, outputPath] = process.argv.slice(2);
  if (!catalogPath || !manifestPath || !outputPath) throw Error('Informe catálogo, manifesto e saída');
  const result = applySuppliedPhotos(JSON.parse(await readFile(catalogPath)), JSON.parse(await readFile(manifestPath)));
  await writeFile(outputPath, JSON.stringify(result, null, 2)+'\n');
  console.log(`${result.summary.imageCandidates} produtos com foto; preços e cadastros preservados.`);
}
