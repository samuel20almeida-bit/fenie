import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('importer', Path(__file__).parents[1] / 'scripts/import-fenie-sheet.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ImportTest(unittest.TestCase):
    def row(self, **changes):
        return dict({'sku': 'TEST-1', 'name': 'Máscara 500g', 'brand': 'Marca', 'line': 'Linha',
                     'price': 123.45, 'situation': 'Ativo', 'sourceRow': 3}, **changes)

    def test_price_and_allowlist(self):
        payload, _ = module.prepare([self.row()])
        product = payload['products'][0]
        self.assertEqual(product['priceCents'], 12345)
        self.assertEqual(product['status'], 'consult')
        self.assertNotIn('cost', product)
        self.assertNotIn('margin', product)
        self.assertEqual(module.SOURCE_COLUMNS['price'], 12)
        self.assertNotIn(7, module.SOURCE_COLUMNS.values())

    def test_blocks_duplicates_instead_of_merging_distinct_items(self):
        payload, review = module.prepare([self.row(), self.row(name='Máscara diferente 500g')])
        self.assertEqual(payload['products'], [])
        self.assertTrue(all('SKU duplicado: corrigir na fonte' in r['blockers'] for r in review))

    def test_does_not_guess_brand_size_or_price(self):
        payload, review = module.prepare([self.row(brand='', price=None, name='Kit sem volumes')])
        self.assertEqual(payload['products'], [])
        self.assertEqual(len(review[0]['blockers']), 3)

    def test_money_and_sizes(self):
        self.assertEqual(module.cents('59,90'), 5990)
        for value in [None, -1, 0, 'NaN', 'Infinity', '1.234', True]:
            self.assertIsNone(module.cents(value))
        self.assertEqual(module.size_from_name('Kit 1,5 Lt + 120ml'), '1,5 L + 120 ml')
        self.assertEqual(module.size_from_name('2 Volumes, tom 7.1'), '')


if __name__ == '__main__':
    unittest.main()
