const RegionPriceUrl = 'https://api.kbland.kr/land-price/price/regionPrice';
const map250Url = 'https://api.kbland.kr/land-complex/map/map250mBlwInfoList';

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    return year + month + day;
}

async function fetchGET(url, params) {
    let requrl = url + '?' + new URLSearchParams(params).toString();

    return fetch(requrl)
        .then(response => response.json())
        .then(jsonData => {
            jsonData = jsonData.dataBody.data;
            return jsonData;
        })
        .catch(error => {
            console.log("error occured");
        });
}

function makePrarams(level, bounds) {

    var swLatLng = bounds.getSouthWest();
    var neLatLng = bounds.getNorthEast();
    let params;
    if (level <= 15) {
        params = {
            "법정동코드": "",
            "레벨": level,
            "시세상태구분": "2",
            "시작위도지점": swLatLng.getLat(),
            "시작경도지점": swLatLng.getLng(),
            "종료위도지점": neLatLng.getLat(),
            "종료경도지점": neLatLng.getLng(),
            "webCheck": "Y"
        }
    }
    else {
        params = {
            "selectCode": "1,2,3",
            "zoomLevel": level,
            "startLat": swLatLng.getLat(),
            "startLng": swLatLng.getLng(),
            "endLat": neLatLng.getLat(),
            "endLng": neLatLng.getLng(),
            "물건종류": "01,02,05,41",
            "거래유형": "1,2,3",
            "webCheck": "Y"
        };
    }

    return params
}

async function fetchPrice(level, bounds) {

    var params = makePrarams(level, bounds);
    let state;

    if (level <= 15) {
        state = State.REGION;

        params = new URLSearchParams(params).toString();
        let requrl = RegionPriceUrl + '?' + params;

        return [await fetchGET(RegionPriceUrl, params), state];
    }

    else if (level > 15) {
        state = State.MAP250;
        return fetch(map250Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(response => response.json())
            .then(jsonData => {
                //console.log(jsonData.dataBody.data);
                return [jsonData.dataBody.data, state];
            })
    }
}

async function fetchDanjiBaseInfo(danjiNum, areaNum) {

    let PrcInfoUrl = 'https://api.kbland.kr/land-price/price/BasePrcInfoNew';
    let params = {
        "단지기본일련번호": danjiNum,
        "면적일련번호": areaNum
    };

    params = new URLSearchParams(params).toString();
    return await fetchGET(PrcInfoUrl, params);
}

async function fetchDanjiChartInfo(danjiNum, areaNum) {

    let today = new Date();
    let threeYearsAgo = new Date(today);
    threeYearsAgo.setFullYear(today.getFullYear() - 3);

    let ChartUrl = 'https://api.kbland.kr/land-price/price/PerMn/IntgrationChart';
    let params = {
        '단지기본일련번호': danjiNum,
        '면적일련번호': areaNum,
        "거래구분": 0,
        "조회구분": 2,
        "조회시작일": getFormattedDate(threeYearsAgo),
        "조회종료일": getFormattedDate(today)
    }

    return await fetchGET(ChartUrl, params);
}

async function fetchDanjiBrifInfo(danjiNum) {
    let BrifInfoUrl = 'https://api.kbland.kr/land-complex/complex/brif';
    let params = {
        "단지기본일련번호": danjiNum
    };

    return await fetchGET(BrifInfoUrl, params);
}
async function fetchDanjimpriInfo(danjiNum) {
    let mpriInfoUrl = 'https://api.kbland.kr/land-complex/complex/mpriByType';
    let params = {
        "단지기본일련번호": danjiNum
    };

    return await fetchGET(mpriInfoUrl, params);
}
// (지역, 단지)의 (매매, 전세) (상한, 하한, 일반) 거래가 정보 fetch
// Input 단지번호만 있으면 될듯 면적 번호는 mpri 받아오기 
async function fetchDanjiInfo(danjiNum) {

    retValue = {};

    // 이 두개 : 평형에 상관없이 제공되는 정보 (아파트명, 평형 정보 등... )
    // 단지의 평형정보 (area Info) 받아오는 함수
    retValue["mpriInfo"] = await fetchDanjimpriInfo(danjiNum);
    // 아파트명, 주소, 세대주 등등 정보
    retValue["brifInfo"] = await fetchDanjiBrifInfo(danjiNum);
    let areaNums = [];

    for (var i = 0; i < retValue["mpriInfo"].length; i++) {
        areaNums.push(retValue["mpriInfo"][i]["면적일련번호"]);
    }

    // 각 평형의 평균 시세, 분석 차트 정보 (areaNum 틀림)
    retValue['baseInfo'] = [];
    for (var areaNum = 0; areaNum < retValue["mpriInfo"].length; areaNum++) {
        const newDanjiBaseInfo = await fetchDanjiBaseInfo(danjiNum, areaNum);
        retValue['baseInfo'].push(newDanjiBaseInfo);
    }

    //retValue['chartInfo'] = await fetchDanjiChartInfo(danjiNum, areaNum);

    return retValue;
}

async function fetchGeoBaseInfo(geoCode, level) {

    let url = "https://api.kbland.kr/land-price/price/regionPrice/detailBaseInfo";
    let params = {
        "법정동코드": geoCode,
        "시세상태구분": 2,
        "레벨": level,
        "webCheck": "Y"
    };

    return await fetchGET(url, params);
}

async function fetchGeoChartInfo(geoCode, level) {

    let url = "https://api.kbland.kr/land-price/price/regionPrice/detailChartList";
    let params = {
        "법정동코드": geoCode,
        "레벨": level,
        "시세상태구분": 2,
        "조회기간구분": 1,
        "webCheck": "Y"
    };

    return await fetchGET(url, params);
}

// 매물 리스트 받아오기
async function fetchGeoInfo(geoCode, level) {
    let retValue = {};
    retValue["baseInfo"] = (await fetchGeoBaseInfo(geoCode, level));
    retValue["chartInfo"] = (await fetchGeoChartInfo(geoCode, level));

    return retValue;
}

// (지역, 단지)의 근 n년 실거래가 정보 fetch
async function fetchSaleInfo() {

}

