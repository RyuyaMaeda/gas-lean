function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  var page = e.parameter["page"];
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
  const spreadSheet = SpreadsheetApp.openById('19of_wJ4xxB7g7Tv7QqKtTWHVS7smYjXVSx06ODhe9Vo');
  const sheet = spreadSheet.getSheetByName(sheetName);
  return sheet;
}

/**
 * IDとpasswordがあっているかを確認する
 * 
 * @param {*} id 
 * @param {*} password 
 * @return {*} 合っていたらtrueを、間違っていたらfalseを返す
 */
function userConfirm(id, password) {
  const sheet = getSheet('ユーザ情報');
  var userData = sheet.getDataRange().getValues();
  var id_check = false;
  userData.shift();
  for (let i = 0; i < sheet.getLastRow()-1; i++) {
    if (id === userData[i][0] && password === userData[i][1]) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * submitUserData()をテストする
 */
function submitUserDataTest() {
  console.log(submitUserData("eiwa0010","b","c","d","e","f"));
}

/**
 * ユーザ情報をDBに登録する
 * @param {*} id 
 * @param {*} password 
 * @param {*} name 
 * @param {*} address 
 * @param {*} phoneNumber 
 * @param {*} school 
 * @return IDがDBにすでにある場合falseをない場合に、trueを返す。
 */
function submitUserData(id, password, name, address, phoneNumber, school) {
  const sheet = getSheet('ユーザ情報');
  var row = sheet.getLastRow();
  if(findRow(sheet, id, 1) != 0) {
    return false;
  } else {
  sheet.getRange(row+1,1).setValue(id);
  sheet.getRange(row+1,2).setValue(password);
  sheet.getRange(row+1,3).setValue(name);
  sheet.getRange(row+1,4).setValue(address);
  sheet.getRange(row+1,5).setValue(phoneNumber);
  sheet.getRange(row+1,6).setValue(school);
    return true;
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
  var data = sheet.getDataRange().getValues();
  data.shift();
  for(let i = 0; i < data.length; i++ ) {
    if(data[i][col-1] === value) {
      return i+2;
    }
  }
  return 0;
}
