import json

input_filename = '/Users/haseungmin/Downloads/geoCode.txt'
output_filename = '/Users/haseungmin/Downloads//KB__20230914/geoCode.json'

result = {}

def convertToJson(line):
    items = line.strip().split("\t")

    if items[2] == '폐지':
        return
    result[items[0]] = { 'address' : items[1]}

with open(input_filename, 'r', encoding='euc-kr', errors='replace') as f:
    read_line = f.readline()
    for index, line in enumerate(f):
        convertToJson(line)

with open(output_filename, 'w', encoding='utf-8', errors='replace') as out:
    json.dump(result, out, ensure_ascii=False)

print("weldone!")