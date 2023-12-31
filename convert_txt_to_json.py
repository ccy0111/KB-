import json

LINES_PER_FILE = 10000

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8', errors='replace') as out:
        json.dump({"data": data}, out, ensure_ascii=False)

# 입력 파일 이름과 출력 파일 이름을 정의
input_filename = '/Users/haseungmin/Downloads/KB__20230914/apartPrice.txt'
output_filename = '/Users/haseungmin/JS_Study/apart_Info/apart_Info{}.json'

# str to json
def convert_line_to_json(line):
    items = line.strip().split("|")[:-1]
    items = [None if not item.strip() else item for item in items]
    if len(items) != len(fields):
        raise ValueError(f"줄에 문제가 있어: {line}")
    return {fields[i]: item for i, item in enumerate(items)}

cur_data = []

# 파일을 줄 단위로 읽으면서 처리
with open(input_filename, 'r', encoding='EUC-KR', errors='replace') as f:
    fields = f.readline().strip().split(" ")
    for index, line in enumerate(f, start=1):
        cur_data.append(convert_line_to_json(line))
    cur_data.sort(key=lambda x: x['법정동코드'])

print("변환 완료!")
