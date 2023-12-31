/*
** read me **

land-price Info will be fetched by this js.
API Info:
url : 'https://api.kbland.kr/land-price/price/regionPrice'

params : read code 18 ~ 27

codes write fetche response in ./land_price/land-price_level.json.

** do not use "법정동코드" params **
*/

const axios = require('axios');
const fs = require('fs');

let url = 'https://api.kbland.kr/land-price/price/regionPrice';

function getparams(level, state) {

    let params = {
        "법정동코드": "",
        "레벨": level,
        "시세상태구분": state,
        '시작위도지점': '31.9874521',
        '시작경도지점': '119.6331208',
        '종료위도지점': '39.4093667',
        '종료경도지점': '135.7830232',
        "webCheck": "Y"
    }
    return params;
}

async function fetchDataAndSave(level, state) {
    try {
        const response = await axios.get(url, {
            params: getparams(level, state)
        });
        fs.writeFileSync('./land_price/land-price?' + 'level=' + level + '.json', JSON.stringify(response.data.dataBody, null, 2));
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    for (let level = 7; level <= 20; level++) {
        await fetchDataAndSave(level, 2);
    }
}

main();