def print_models(models):
    """打印模型"""
    finished_designs = []
    sliced_designs = models.copy()
    while sliced_designs:
        finished_designs.append(sliced_designs.pop())
    return finished_designs


def show_completed_models(models):
    """显示已完成的模型"""
    print("\nThe following models have been printed:")
    for model in models:
        print(model)


def accumulator():
    """加法运算"""
    from functools import reduce

    print("Give me two numbers, and I'll divide them.")
    print("Enter 'q' to quit.")

    def trans_2_int(str):
        return int(str)

    input_str = ""
    num_list = []
    while input_str != "q":
        try:
            input_str = input(
                "\nPlease input a number to accumulate ('q' to execute): "
            )
            if input_str != "q":
                num = trans_2_int(input_str)
                num_list.append(num)
        except ValueError:
            print("Value invalid! Input should be numbers")
    result = reduce(lambda acc, val: acc + val, num_list)
    print(f"{' + '.join([*map(str, num_list)])} = {result}")


def read_pets(files):
    files = files[:]
    while files:
        filename = files.pop(0)
        try:
            with open(filename, encoding="utf-8") as f:
                content = f.read()
                print(content.strip())
        except FileNotFoundError:
            pass


def divide():
    print("Give me two numbers, and I'll divide them.")
    print("Enter 'q' to quit.")

    while True:
        first_num_str = input("\nFirst number: ")
        try:
            first_num = int(first_num_str)
        except ValueError:
            continue
        if first_num_str == "q":
            break
        sec_num_str = input("\nSecond number: ")
        try:
            second_num = int(sec_num_str)
        except ValueError:
            continue
        if sec_num_str == "q":
            break
        try:
            answer = first_num / second_num
        except ZeroDivisionError:
            print("You can't divide by 0!")
        else:
            print(answer)


divide()
