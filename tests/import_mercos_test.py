import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('mercos', Path(__file__).parents[1] / 'scripts/import-mercos.py')
mercos = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mercos)


def record(sku='OLK-TEST'):
    return dict(sku=sku, name='Máscara Olenka 500g', price=19.9, unit='Un', group='OLENKA', category='Máscaras', subcategory='', inactive=0, hidden=0, sourceRow=2)


class ImportMercosTest(unittest.TestCase):
    def test_standard_price_cart_identity_and_private_fields(self):
        row = record()
        row.update(minimum=4, wholesale=7, commission=20, stock=82, description='Conteúdo sem revisão')
        old = {'products': [{'sku': 'OLK-TEST', 'id': 'existing', 'slug': 'existing-product', 'priceCents': 2600, 'brand': 'OLENKA', 'order': 0}]}
        payload, _ = mercos.prepare([row], old)
        p = payload['products'][0]
        self.assertEqual((p['id'], p['slug'], p['priceCents']), ('existing', 'existing-product', 1990))
        self.assertEqual(payload['summary']['changedPrices'], 1)
        self.assertFalse({'minimum','wholesale','commission','stock','description'}.intersection(p))

    def test_duplicates_are_withheld_even_if_one_is_inactive(self):
        duplicate = record('a'); duplicate['inactive'] = 1
        rows = [record('A'), duplicate, record(''), record('B'), record('C')]
        rows[3]['hidden'] = 1; rows[4]['inactive'] = 1
        payload, audit = mercos.prepare(rows, {})
        self.assertEqual(payload['products'], [])
        self.assertEqual(len(audit['excluded']), 5)

    def test_courses_are_not_brands_and_unknown_size_is_not_invented(self):
        row = record(); row.update(group='CURSOS', name='Curso de cabelo', category=None)
        payload, _ = mercos.prepare([row], {})
        p = payload['products'][0]
        self.assertEqual(p['brand'], 'Marca a confirmar')
        self.assertEqual(p['sourceGroup'], 'CURSOS')
        self.assertEqual(p['size'], 'Embalagem a confirmar')

    def test_missing_previous_sku_is_removed_instead_of_retaining_old_price(self):
        old = {'products': [{'id':'old', 'sku':'old'}]}
        payload, audit = mercos.prepare([record()], old)
        self.assertEqual(payload['summary']['previousProductsRemoved'], 1)
        self.assertEqual(audit['previousMissing'], ['old'])


if __name__ == '__main__':
    unittest.main()
