/*

this js is for fetching wgs 84 coords from kakao api

Input file : geoCode.json
Output file : geoCode.json

what's in geoCode

Array: [
    "geoCode" : {
        address: "지번".
        lat: "위도",
        lng: "경도"
    },
    ...
]

lat and lng will be updated by this js 
*/


const fs = require('fs');
const path = require('path');
const axios = require('axios');

const filePath = path.join(__dirname, './geoCode.json');

let url = 'https://dapi.kakao.com/v2/local/search/address';




let serviceKey = '783655cfe1e39179f47db5ce5db1579a';

// 파일 읽기
fs.readFile(filePath, 'utf8', (err, jsonString) => {
    if (err) {
        console.error("파일 읽기 중 에러 발생:", err);
        return;
    }
    const data = JSON.parse(jsonString);  // JSON 형식의 문자열을 객체로 변환
    //console.log(data);
});


// 외부 함수 예시 (실제 외부 함수의 호출 방식에 따라 수정이 필요할 수 있어)
async function getCoordinates(address) {
    let errOccured = false;
    // 외부 API 또는 함수 호출하여 좌표값을 가져옴
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': 'KakaoAK' + " " + serviceKey
            },

            params: {
                'query': address,
                'size': 1
            }

        });

        // 좌표값이 undefined인 경우 null로 할당
        let lat = null;
        let lng = null;

        if (response.data.documents && response.data.documents.length > 0) {
            lat = response.data.documents[0].y || null;
            lng = response.data.documents[0].x || null;
        }

        // lng 또는 lat 값이 null인 경우, 원하는 에러 메시지 출력
        if (lng === null || lat === null) {
            console.log(`주소 ${address}에 대한 좌표값을 찾을 수 없어.`);
        }

        return { lat: lat, lng: lng };

    } catch (error) {
        return { lng: null, lat: null };
    }
}

async function updateGeoData() {
    fs.readFile(filePath, 'utf8', async (err, jsonString) => {
        if (err) {
            console.error("파일 읽기 중 에러 발생:", err);
            return;
        }

        const data = JSON.parse(jsonString);

        let index = 0;
        let length = Object.keys(data).length;

        for (let key in data) {
            const coords = await getCoordinates(data[key].address);
            let persent = (index / length * 100).toFixed(2);
            process.stdout.write(`\rupdating... ${persent}%`);
            index++;

            data[key].lat = coords.lat;
            data[key].lng = coords.lng;
        }

        // 수정된 데이터를 다시 JSON 파일로 저장
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) console.error("파일 저장 중 에러 발생:", err);
            else console.log("JSON 파일이 성공적으로 업데이트됨!");
        });
    });
}

updateGeoData();
