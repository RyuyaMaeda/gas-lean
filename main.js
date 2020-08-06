function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  const page = e.parameter["page"];
  if (page === "mypage") {
    const template = HtmlService.createTemplateFromFile("mypage");
    template.mydata = e.parameter["username"];
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
  const userData = sheet.getDataRange().getValues();
  userData.shift();
  for (let i = 0; i < sheet.getLastRow() - 1; i++) {
    if (id === userData[i][0] && password === userData[i][1]) {
      return userData[i][2];
    } 
  }
  return false;
}

/**
 * submitUserData()をテストする
 */
function submitUserDataTest() {
  var data = ["eiwa0011","b","c","d","e","f"];
  console.log(submitUserData(data));
}

/**
 * ユーザ情報をDBに登録する
 * @param {*} userDataArray id、password、名前、 住所、電話番号、学校名を含む配列
 * @return {*} IDがDBにすでにある場合falseをない場合に、氏名を返す。
 */
function submitUserData(userDataArray) {
  const sheet = getSheet('ユーザ情報');
  if(findRow(sheet, userDataArray[0], 1) != 0) {
    return false;
  } else { 
  sheet.appendRow(userDataArray);
    return userDataArray[2];
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
  const data = sheet.getDataRange().getValues();
  data.shift();
  for(let i = 0; i < data.length; i++ ) {
    if(data[i][col-1] === value) {
      return i+2;
    }
  }
  return 0;
}

/**
 * ユーザIDからイベントIDを取得する
 */
// function getEventId(userId) {

// }
