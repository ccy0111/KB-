
var markers = [];



function removeAllMarkers() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function removeMarkersByBoundary(mapBounds) {
    for (var i = 0; i < markers.length; i++) {
        let lat = markers[i].getPosition().getLat();
        let lng = markers[i].getPosition().getLng();

        if (!isWithInBoundary(mapBounds, lat, lng)) {
            markers[i].setMap(null);
        }
    }
}

async function handleMarkerClick(data, state) {
    //console.log(state);
    //console.log(data);
    var lat = parseFloat(data["wgs84위도"]) || parseFloat(data["wgs84중심위도"]);
    var lng = parseFloat(data["wgs84경도"]) || parseFloat(data["wgs84중심경도"]);

    var moveLatLng = new kakao.maps.LatLng(lat, lng);
    makeSideBar(data, state);
    map.panTo(moveLatLng);
}

function makeMarkers(datas, map) {

    let state = datas[1];
    let items = datas[0];

    if (state == State.MAP250) {

        let saleList = items["매물리스트"];
        state = State.SALE;
        makeEachMarker(saleList, state, map);

        let danjiList = items["단지리스트"];
        state = State.DANJI;
        makeEachMarker(danjiList, state, map);
    }

    else if (state == State.REGION) {

        if (items == undefined) {
            console.log('items is undefined');
            return;
        }

        makeEachMarker(items, state, map);
        //return markers;
    }

    return markers;
}

function makeEachMarker(items, state, map) {

    items.forEach(item => {
        let content = makeContent(item, state);
        var lat = parseFloat(item["wgs84중심위도"]) || parseFloat(item["wgs84위도"]);
        var lng = parseFloat(item["wgs84중심경도"]) || parseFloat(item["wgs84경도"]);

        var marker = new kakao.maps.CustomOverlay({
            map: map,
            clickable: true,
            position: new kakao.maps.LatLng(lat, lng),
            content: content,
        });

        marker.setMap(map);
        markers.push(marker);
    });

    return markers;
}

function makeContent(item, state) {

    let content;

    if (state == State.REGION) {
        content = `
                    <div class="region_Marker_Container" onclick='handleMarkerClick(${JSON.stringify(item)}, "${state}")'">
                        <div class= "region_Name_Container">
                            <Strong class = 'region_name'> ${item["지역명"]}</Strong>
                            </div>
                        <div class= "region_Price_Container">
                            <span class = 'region_price'> ${item["매매평균가"]}억</span>
                            </div>
                        </div> 
                        `;
    }



    else if (state == State.SALE) {

        return;
        var width = item["매물개수"] * 1.2

        if (width > 150) {
            width = 150;
        }
        else if (width < 30) {
            width = 30;
        }

        var height = width;

        content = `     
                    <div class = "marker_Container">
                        <div class = "sale_Marker_Container" style="width: ${width}px; height: ${height}px;" onclick='handleMarkerClick(${JSON.stringify(item)}, "${state}")'>
                            <div class="saleNum">
                            ${item["매물개수"]}
                                </div>
                            </div>
                        </div>
                        `;
    }

    else if (state == State.DANJI) {

        let avgPrice

        if (item["매매평균가"] == undefined || item["매매평균가"] == null) {
            avgPrice = "";

            content = `
                    <div class="danji_Marker_Container" onclick='handleMarkerClick(${JSON.stringify(item)}, "${state}")'>
                        <div class="empty">
                            <div class="roof"> </div>
                            <div class="floor"> </div>
                            </div>
                        </div>
                        `;
        }
        else {
            avgPrice = item["매매평균가"] + '억';
            content = `
                    <div class="danji_Marker_Container" onclick='handleMarkerClick(${JSON.stringify(item)}, "${state}")'>
                        <div class="not_empty">
                            <div class="year">
                                ${item["준공년도"]} 
                                </div>
                            <div class="infoBox">
                                <div class="avgPrice">
                                    ${avgPrice}
                                    </div>
                                <div class="supply">
                                    ${item["최소공급면적"]}~${item["최대공급면적"]}m<sup>2</sup>
                                    </div >
                                </div>
                            </div>
                        </div>
                        `;
        }

    }
    return content;
}

