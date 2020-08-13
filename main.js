const requestSheet = getSheet("申込状況");
const userInfoSheet = getSheet("ユーザ情報");

function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  const page = e.parameter["page"];
  if (page === "mypage") {
    return HtmlService.createTemplateFromFile("mypage").evaluate();
  } else if (page === "create") {
    return HtmlService.createTemplateFromFile("create").evaluate();
  } else {
    return HtmlService.createTemplateFromFile("login").evaluate();
  }
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
 * @return {*} 合っていたらtrueを、間違っていたらfalseを返す
 */
function userConfirm(id, password) {
  const userData = userInfoSheet.getDataRange().getValues();
  userData.shift();
  for (let i = 0; i < userInfoSheet.getLastRow() - 1; i++) {
    if (id === userData[i][0] && password === userData[i][1]) {
      return true;
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
    submitUserDataOnUserInfoSheet(userDataArray);
    submitUserDataOnRequestSheet(userDataArray[0]);
  } catch (e) {
    throw new Error("IDがすでに存在しています")
  }
}

/**
 * 新規登録した時にuser情報をユーザ情報シートに登録する
 * @param {*} userDataArray id、password、名前、 住所、電話番号、学校名を含む配列
 * IDがDBにすでにある場合errorを返す。
 */
function submitUserDataOnUserInfoSheet(userDataArray) {
  if (findRow(userInfoSheet, userDataArray[0], 1) != 0) {
    throw new Error("IDがすでに存在しています");
  } else {
    userInfoSheet.appendRow(userDataArray);
    return;
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
