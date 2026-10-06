import { readFile } from 'node:fs/promises';
import { validateCatalog } from '../public/catalogo-lab/core.mjs';
const file = process.argv[2];
if (!file) { console.error('Uso: node scripts/validate-catalog.mjs caminho/catalogo.json'); process.exit(1); }
try {
  const data = validateCatalog(JSON.parse(await readFile(file, 'utf8')));
  console.log(`Catálogo válido: ${data.products.length} SKUs. Revise preços, fotos e conteúdo comercial antes de publicar.`);
} catch (error) { console.error(error.message); process.exit(1); }
