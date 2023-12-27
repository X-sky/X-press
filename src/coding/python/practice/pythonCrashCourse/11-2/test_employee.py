import unittest
from employee import Employee


class TestEmployee(unittest.TestCase):
    def setUp(self):
        """创建默认数据"""
        self.info = {"first_name": "Maria", "last_name": "Rose", "salary": 1000}
        self.employee = Employee(*self.info.values())

    def test_give_default_raise(self):
        self.employee.give_raise()
        self.assertEqual(self.employee.salary, 6000)

    def test_give_custom_raise(self):
        self.employee.give_raise(1000)
        self.assertEqual(self.employee.salary, 2000)


if __name__ == "__main__":
    unittest.main()
