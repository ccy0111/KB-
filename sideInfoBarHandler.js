

function closeSideBar() {
    setSideBarOpacity(0);
    document.getElementById('sidebar_Container').style.zIndex = -1;
}

function openSideBar(data, state) {
    makeSideBar(data, state);
}

function setSideBarOpacity(opacity) {
    document.getElementById('sidebar_Container').style.opacity = opacity;
}

async function MoneyToString(value) {
    if (value == '시세정보없음') {
        return value;
    }
    let retValue = '';
    let money = Math.floor(value / 10000);

    let money2 = (value % 10000).toString();

    if (money != 0) {
        retValue += money.toString() + '억 ';
    }
    if (money2 != 0) {
        retValue += money2;
    }
    retValue = (retValue == '' ? '시세정보없음' : retValue);
    return retValue;
}

async function makeDanjiBrifInfo(brifInfo) {
    if (brifInfo == '단지정보없음') {
        console.log("error while brif");
        return;
    }

    let danjiName = brifInfo?.["단지명"] || '단지정보없음';
    let danjiType = brifInfo?.["매물종별구분명"] || '단지정보없음';
    let totalHouse = brifInfo?.["총세대수"] || '단지정보없음';

    let minSupply = brifInfo?.["최소공급면적"] || '단지정보없음';
    let maxSupply = brifInfo?.["최대공급면적"] || '단지정보없음';

    let lat = brifInfo?.["wgs84위도"] || '단지정보없음';
    let lng = brifInfo?.["wgs84경도"] || '단지정보없음';
    let address = await new_GeoCode(lat, lng);

    return `
    <div class="sidebar_DanjiInfo_BrifContainer">
        <p style="font-size: 30px;font-weight: 500;"> ${danjiName} </p>
        <p> ${danjiType} | ${totalHouse}세대</p>
        <p> ${minSupply}~${maxSupply}m<sup>2</sup></p>
        <p> ${address} </p>
    </div>
    `;
}

async function makeBaseInfoTable(baseInfo, mpriInfo) {

    let html = ``;
    let upperPrice = baseInfo?.["시세"]?.[0]?.['매매상한가'] || '시세정보없음';
    let lowerPrice = baseInfo?.["시세"]?.[0]?.['매매하한가'] || '시세정보없음';
    let aver_Price = baseInfo?.["시세"]?.[0]?.['매매평균가'] || '시세정보없음';

    let upperCharter = baseInfo?.["시세"]?.[0]?.['전세상한가'] || '시세정보없음';
    let lowerCharter = baseInfo?.["시세"]?.[0]?.['전세하한가'] || '시세정보없음';
    let aver_Charter = baseInfo?.["시세"]?.[0]?.['전세평균가'] || '시세정보없음';

    let supplyArea = mpriInfo?.["공급면적"] || '시세정보없음';
    let reasableArea = mpriInfo?.["전용면적"] || '시세정보없음';

    html = `
        <table>
            <thead>
                <tr>
                    <th> type </th>
                    <th> 하한가 </th>
                    <th> 일반가 </th>
                    <th> 상한가 </th>
                </tr>
            </thead>
            <p style="text-align: left;"> ${supplyArea}m<sup>2</sup> | ${reasableArea}m<sup>2</sup> </p>
            <tbody>
                <tr>
                    <td> 매매 </td>
                    <td> ${await MoneyToString(lowerPrice)} </td>
                    <td> ${await MoneyToString(aver_Price)} </td>
                    <td> ${await MoneyToString(upperPrice)} </td>
                </tr>
                <tr>
                    <td> 전세 </td>
                    <td> ${await MoneyToString(lowerCharter)} </td>
                    <td> ${await MoneyToString(aver_Charter)} </td>
                    <td> ${await MoneyToString(upperCharter)} </td>
                </tr>
            </tbody>`;

    return html;
}

async function makeDanjiInnerHTML(brifInfoHTML, baseInfoTableHTML) {

    console.log(brifInfoHTML, baseInfoTableHTML);
    document.getElementById('sidebar_Container').innerHTML = `
            <input id="sidebar_close_Button" type="button" value="<" onclick="closeSideBar()">
                <hr>
                    <div id="sidebar_DanjiInfo_Container">
                        ${brifInfoHTML}
                        <hr>
                        <div id="sidebar_DanjiInfo_BaseInfo_Container">
                        ${baseInfoTableHTML}
                        </div>
                        </div>
                            `;
}

async function makeSideBar(data, state) {

    let content_Info;
    document.getElementById('sidebar_Container').style.zIndex = 2;
    document.getElementById('sidebar_Container').style.opacity = 1;

    if (state == State.SALE) {
        document.getElementById('sidebar_Container').innerHTML =
            `<input id="sidebar_close_Button" type="button" value="<" onclick="closeSideBar()">
            <div> no contents </div>
            `;
    }

    if (state == State.DANJI) {
        content_Info = await fetchDanjiInfo(data["단지기본일련번호"]);
        console.log(content_Info);

        let brifInfoHTML = await makeDanjiBrifInfo(content_Info?.['brifInfo']);
        let baseInfoTableHTML = ``

        for (var i = 0; i < content_Info?.['baseInfo'].length; i++) {
            baseInfoTableHTML += await makeBaseInfoTable(content_Info?.['baseInfo']?.[i], content_Info?.['mpriInfo']?.[i]);
        }


        await makeDanjiInnerHTML(brifInfoHTML, baseInfoTableHTML);
        const doc = document.getElementById('sidebar_DanjiInfo_Container');

    }

    if (state == State.REGION) {
        let level = ConvertZoomLevel_KakaoToNaver(getMap().getLevel());
        content_Info = await fetchGeoInfo(data["법정동코드"], level);
        console.log(content_Info);

        let averPrice = content_Info?.["baseInfo"]?.['매매평균가'] || '시세정보없음';
        let averCharter = content_Info?.["baseInfo"]?.['전세평균가'] || '시세정보없음';

        document.getElementById('sidebar_Container').innerHTML = `
                            <input id="sidebar_close_Button" type="button" value="<" onclick="closeSideBar()">
                                <bt>
                                    <div>
                                            매매 평균가 = ${averPrice} <br>
                                            전세 평균가 = ${averCharter} <br>
                                            </div>
                                            `;
        console.log(averPrice, averCharter);
    }
}

