class Employee:
    def __init__(self, first_name, last_name, salary):
        print(first_name)
        self.first_name = first_name
        self.last_name = last_name
        self.salary = salary

    def give_raise(self, custom=None):
        if custom:
            self.salary += custom
        else:
            self.salary += 5000
