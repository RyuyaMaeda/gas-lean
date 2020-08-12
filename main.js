function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  var page = e.parameter["page"];
  if (page === "mypage") {
    const template = HtmlService.createTemplateFromFile("mypage");
    let eventDataArray = getEventInfo();
    eventDataArray.shift();
    template.eventDataArray = eventDataArray;
    let userName = e.parameter["username"];
    template.userName = userName;
    let id = e.parameter["userid"];
    template.userId = id;
    return template.evaluate();
  } else if (page === "create") {
    return HtmlService.createTemplateFromFile("create").evaluate();
  } else {
    return HtmlService.createTemplateFromFile("login").evaluate();
  }
}

function getData(mydata) {
  return mydata + "さん";
}

/**
 * シートを取得する
 *
 * @param {*} sheetName
 * @return {*} シートを返す
 */
function getSheet(sheetName) {
  const spreadSheet = SpreadsheetApp.openById("19of_wJ4xxB7g7Tv7QqKtTWHVS7smYjXVSx06ODhe9Vo");
  const sheet = spreadSheet.getSheetByName(sheetName);
  return sheet;
}

/**
 * AppのURLを返す
 */
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * IDとpasswordがあっているかを確認する
 *
 * @param {*} id
 * @param {*} password
 * @return {*} 合っていたら氏名を、間違っていたらfalseを返す
 */
function userConfirm(id, password) {
  const sheet = getSheet("ユーザ情報");
  const userDataArray = sheet.getDataRange().getValues();
  userDataArray.shift();
  for (let i = 0; i < sheet.getLastRow() - 1; i++) {
    if (id === userDataArray[i][0] && password === userDataArray[i][1]) {
      return userDataArray[i];
    }
    return false;
  }
}

/**
 * ユーザ情報をDBに登録する
 * @param {*} userDataArray id、password、名前、 住所、電話番号、学校名を含む配列
 * @return {*} IDがDBに登録されていない場合、userDataArrayを返す。IDがDBにすでにある場合errorを返す。
 */
function submitUserData(userDataArray) {
  const sheet = getSheet("ユーザ情報");
  if (findRow(sheet, userDataArray[0], 1) != 0) {
    throw new Error("IDがすでに存在しています");
  } else {
    sheet.appendRow(userDataArray);
    return userDataArray;
  }
}

/**
 * シートの指定した列に指定した値と同じ値があるかどうかを判定する
 * @param {*} sheet
 * @param {*} value
 * @param {*} col
 * @return {*} 同じ値がある場合、その行番号を返す、ない場合、0を返す
 */
function findRow(sheet, value, col) {
  let data = sheet.getDataRange().getValues();
  data.shift();
  for (let i = 0; i < data.length; i++) {
    if (data[i][col - 1] === value) {
      return i + 2;
    }
  }
  return 0;
}

/**
 * イベント詳細情報を取得する
 * @return {*} イベント詳細情報の配列を返す
 */
function getEventInfo() {
  const sheet = getSheet("イベント詳細");
  let data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    data[i][2] = convertDate(data[i][2]);
    data[i][4] = convertDate(data[i][4]);
  }
  return data;
}

/**
 * 日付のフォーマットを変更する
 * @param {*} date
 * @return {*} 変更後の日付を返す
 */
function convertDate(date) {
  return Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd");
}

/**
 * ユーザIDからイベントIDを取得する
 * @param {*} sheet
 * @param {*} userId
 * @return {*} イベントIDを返す
 */
function getEventId(userId) {
  const sheet = getSheet("申込状況");
  const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 2).getValues();
  let userEventData = [];
  for (let i = 0; i < data.length; i++) {
    if (userId === data[i][0]) {
      userEventData.push(data[i][1]);
    } else {
      userEventData.push(0);
    }
  }
  return userEventData;
}




/**
 * ソート関数
 * @param {*} arr
 * @return {*} ソート後の配列を返す
 */
function sort(arr) {
  var cnt = arr.length - 1;//ソート範囲
  while (cnt > 0) {
    for (var i = 0; i < cnt; i++) {
      var j = i + 1;//右の要素と比較
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    cnt--;
  }
  return arr;
}
