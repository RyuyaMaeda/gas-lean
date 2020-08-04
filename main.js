function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
}

function doGet(e) {
  var page = e.parameter["page"];
  if (page === "mypage") {
    return HtmlService.createTemplateFromFile("mypage").evaluate();
  } else {
    return HtmlService.createTemplateFromFile("login").evaluate();
  }
}

/**
 * スプレッドシートを取得する
 */
function getSpreadSheet() {
  return SpreadsheetApp.openById('19of_wJ4xxB7g7Tv7QqKtTWHVS7smYjXVSx06ODhe9Vo');
}

/**
 * userConfirmtest用
 */
function test () {
  console.log(userConfirm("a","b"));
}

/**
 * IDとpasswordがあっているかを確認する
 * 
 * @param {*} id 
 * @param {*} password 
 * @return {*} 合っていたらtrueを、間違っていたらfalseを返す
 */
function userConfirm(id, password) {
  const spreadSheet = getSpreadSheet();
  const sheet = spreadSheet.getSheetByName('ユーザ情報');
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
