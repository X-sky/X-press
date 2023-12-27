def get_formatted_city(city, country, population=None):
    """生成国家名称"""
    concated_str = f"{city.title()}, {country.title()}"
    if population != None:
        concated_str += f" - population {population}"
    return concated_str
