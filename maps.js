

function ConvertZoomLevel_KakaoToNaver(level) {
    if (level <= 11) {
        return 20 - level;
    }
    return 7;
}

function isWithInBoundary(mapBounds, lat, lng) {
    // neLatLng: 지도의 우측 상단 위경도
    var swLatLng = mapBounds.getSouthWest();
    var neLatLng = mapBounds.getNorthEast();

    let isWithIn_Lat_Boundary = swLatLng.getLat() <= lat && neLatLng.getLat() >= lat;
    let isWithIn_Lng_Boundary = swLatLng.getLng() <= lng && neLatLng.getLng() >= lng;

    return isWithIn_Lat_Boundary && isWithIn_Lng_Boundary;
}

function isWithInLevel(marker, mapLevel) {

}