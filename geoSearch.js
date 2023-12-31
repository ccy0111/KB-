// 지역 검색 //

var geocoder = new kakao.maps.services.Geocoder();

const new_Center = value => {
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(value, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                resolve({ "lat": result[0].y, "lng": result[0].x });
            }
            else {
                reject("error");
            }
        });
    });
}

const new_GeoCode = (lat, lng) => {
    return new Promise((resolve, reject) => {
        geocoder.coord2RegionCode(lng, lat, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                //console.log(result);
                resolve(result[0].address_name);
            }
            else {
                reject("error");
            }
        });
    });
}

async function SearchAddress() {
    let value = document.getElementById("address_Input").value;

    var options = {
        page: 1,
        size: 1,
        analyze_type: 'EXACT'
    };

    document.getElementById("address_Input").value = "";
    const result = await new_Center(value);
    const code = await new_GeoCode(result["lat"], result["lng"]);
    map.setCenter(new kakao.maps.LatLng(result["lat"], result["lng"]));
}