/*

*** read me ***

apart-price will be fetched by this js.
API Info:
url : 'https://api.kbland.kr/land-complex/map/map250mBlwInfoList;
method : 'POST'

requset : read code

*/

let body = {
    "selectCode": "1,2,3",
    "zoomLevel": 16,
    "startLat": 37.5152334,
    "startLng": 126.889494,
    "endLat": 37.5186458,
    "endLng": 126.9051045,
    "물건종류": "01,02,05,41",
    "webCheck": "Y"
};

let url = 'https://api.kbland.kr/land-complex/map/map250mBlwInfoList';

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
}).then(response => response.json())
    .then(data => {
        console.log(data.dataBody);
    }
    ).catch(error => {
        console.log(error);
    });

