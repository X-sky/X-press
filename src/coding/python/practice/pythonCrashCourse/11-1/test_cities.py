import unittest
from city_functions import get_formatted_city


class CountryCityNameTestCase(unittest.TestCase):
    def test_city_country(self):
        formatted_name = get_formatted_city("santiago", "chile")
        self.assertEqual(formatted_name, "Santiago, Chile")

    def test_city_country_with_population(self):
        formatted_name = get_formatted_city("santiago", "chile", 50000)
        self.assertEqual(formatted_name, "Santiago, Chile - population 50000")


if __name__ == "__main__":
    unittest.main()
