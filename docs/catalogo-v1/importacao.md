# Importação da planilha Fenié

O importador `scripts/import-fenie-sheet.py` lê a aba CATALOGO de um arquivo XLSX e produz dois arquivos locais: catálogo para revisão e fila de pendências. Requer Python 3 e openpyxl.

```bash
python3 scripts/import-fenie-sheet.py SOURCE.xlsx DESTINATION_DIRECTORY
python3 tests/import_fenie_sheet_test.py
```

O arquivo original não é modificado. Cabeçalhos precisam corresponder ao modelo; alterações interrompem o processo. O preço é obtido exclusivamente de PREÇO PRATICADO. SKUs duplicados, campos ausentes e quantidades sem indicação explícita na descrição ficam para revisão. Custos, margens e dados financeiros de outros canais não entram nos arquivos comerciais.

Os testes usam produtos e preços fictícios. O importador não publica arquivos e não atualiza a Vercel. Os resultados reais devem ser revisados antes de qualquer publicação; o destino público e o conteúdo comercial precisam estar autorizados.
