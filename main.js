const userInfoSheet = getSheet("ユーザ情報");
const requestSheet = getSheet("申込状況");
const eventSheet = getSheet("イベント詳細");

function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  let page = e.parameter["page"];
  if (page === "mypage") {
    const template = HtmlService.createTemplateFromFile("mypage");
    let eventDataArray = getEventInfo();
    eventDataArray.shift();
    template.eventDataArray = eventDataArray;
    const userName = e.parameter["userName"];
    template.userName = userName;
    let id = e.parameter["userid"];
    template.userId = id;
    let eventIdList = getEventId(id);
    template.eventIdList = eventIdList;
    return template.evaluate();
  } else if (page === "create") {
    return HtmlService.createTemplateFromFile("create").evaluate();
  } else if (page === "eventDetail") {
    const template = HtmlService.createTemplateFromFile("eventDetail");
    let eventDataArray = getEventInfo();
    let eventNumber = e.parameter["eventNumber"];
    let eventDetailArray = eventDataArray[eventNumber];
    template.eventNumber = eventNumber;
    template.eventDataArray = eventDetailArray;
    let id = e.parameter["userId"];
    template.userId = id;
    const userName = e.parameter["userName"];
    template.userName = userName;
    return template.evaluate();
  }
  else {
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
  const userDataArray = userInfoSheet.getDataRange().getValues();
  userDataArray.shift();
  for (let i = 0; i < userInfoSheet.getLastRow() - 1; i++) {
    if (id === userDataArray[i][0] && password === userDataArray[i][1]) {
      return userDataArray[i];
    }
  }
  return false;
}

/**
 * ユーザ情報をDBに登録する
 * @param {*} userDataArray
 */
function submitUserData(userDataArray) {
  try {
    submitUserDataOnRequestSheet(userDataArray[0]);
    return submitUserDataOnUserInfoSheet(userDataArray);
  } catch (e) {
    throw new Error("IDがすでに存在しています")
  }
}

/**
 * 新規登録した時にuser情報をユーザ情報シートに登録する
 * @param {*} userDataArray id、password、名前、 住所、電話番号、学校名を含む配列
 * @return {*} IDがDBに登録されていない場合、userDataArrayを返す。IDがDBにすでにある場合errorを返す。
 */
function submitUserDataOnUserInfoSheet(userDataArray) {
  if (findRow(userInfoSheet, userDataArray[0], 1) != 0) {
    throw new Error("IDがすでに存在しています");
  } else {
    userInfoSheet.appendRow(userDataArray);
    return userDataArray;
  }
}

/**
 * 新規登録した時にuser情報を申し込みシートに記入する
 */
function submitUserDataOnRequestSheet(userId) {
  const colNumber = requestSheet.getLastColumn();
  let userDataArray = [];
  userDataArray.push(userId);
  for (let i = 0; i < colNumber - 1; i++) {
    userDataArray.push(false);
  }
  requestSheet.appendRow(userDataArray);
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
 * イベントIDに応じたイベント詳細情報を取得する
 * @return {*} イベント詳細情報の配列を返す
 */
function getEventDetail(eventId) {
  let data = eventSheet.getDataRange().getValues();
  let eventData = data[eventId];
  eventData[2] = convertDate(eventData[2]);
  eventData[4] = convertDate(eventData[4]);
  return eventData;
}

/**
 * イベント詳細情報を取得する
 * @return {*} イベント詳細情報の配列を返す
 */
function getEventInfo() {
  let data = eventSheet.getDataRange().getValues();
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
 * ユーザIDから登録しているイベントの情報を取得する
 * @param {*} sheet
 * @param {*} userId
 * @return {*} イベントごとの申し込み状況(TRUE or FALSE)の配列を返す
 */
function getEventId(userId) {
  const data = requestSheet.getDataRange().getValues();
  data.shift();
  userDataArray = new Array(data[0].length - 1);
  for (let i = 0; i < data.length; i++) {
    if (userId === data[i][0]) {
      for (let j = 1; j <= userDataArray.length; j++) {
        userDataArray[j - 1] = data[i][j];
      }
      return userDataArray;
    }
  }
}

/**
 * 申し込み状況を更新する
 * @param {*} userId
 * @param {*} eventId
 */
function eventRequestChange(userId, eventId) {
  const data = requestSheet.getDataRange().getValues();
  data.shift();
  for (let i = 0; i < data.length; i++) {
    if (userId === data[i][0]) {
      // console.log(data[i][eventId])
      requestSheet.getRange(i + 2, eventId + 1).setValue(!(data[i][eventId]));
    }
  }
}
