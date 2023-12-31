
function fetchPrice() {

    var level = map.getLevel();
    var convertedLevel = ConvertZoomLevel_KakaoToNaver(level);

    if (convertedLevel > 15) {
        test();
        return;
    }

    let url = 'land_price/land-price?level=7.json';
    params = '?' + 'level' + '=' + convertedLevel + '.json';
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('error occured while requset: url : ' + url);
            }
            return response.json();
        })
        .then(jsonData => {

            priceInfos = jsonData.data.filter(item => {
                var mapBounds = map.getBounds();

                var lat = parseFloat(item["wgs84중심위도"]);
                var lng = parseFloat(item["wgs84중심경도"]);

                let canMakeMarker = isWithInBoundary(mapBounds, lat, lng);

                if (canMakeMarker) {
                    makeMarker(item);
                }

                return canMakeMarker;
            });

        })
        .catch(error => {
            console.error("로컬 파일 로딩 중 에러 발생:", error);
        });
}


function test() {
    var level = map.getLevel();
    var convertedLevel = ConvertZoomLevel_KakaoToNaver(level);

    let test_url = 'https://api.kbland.kr/land-complex/map/map250mBlwInfoList';
    var mapBounds = map.getBounds();

    var swLatLng = mapBounds.getSouthWest();
    var neLatLng = mapBounds.getNorthEast();

    let body = {
        "selectCode": "1,2,3",
        "zoomLevel": convertedLevel,
        "startLat": swLatLng.getLat(),
        "startLng": swLatLng.getLng(),
        "endLat": neLatLng.getLat(),
        "endLng": neLatLng.getLng(),
        "물건종류": "01,02,05,41",
        "거래유형": "1,2,3",
        "webCheck": "Y",
        "단지기본일련번호": 2265
    };

    fetch(test_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(response => response.json())
        .then(jsonData => {
            console.log(jsonData.dataBody.data);
        })
}