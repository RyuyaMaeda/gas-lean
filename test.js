/**
 * userConfirm()をテストする
 */
function userConfirmTest() {
  console.log(userConfirm("eiwa001", "eiwa"));
}

/**
 * submitUserData()をテストする
 */
function submitUserDataTest() {
  const data = ["eiwa001", "b", "c", "d", "e", "f"];
  try {
    submitUserData(data);
  } catch (e) {
    console.log(e.message);
  }
}

/**
 * findRow()をテストする
 */
function findRowTest() {
  const sheet = getSheet("ユーザ情報");
  console.log(findRow(sheet, "eiwa001", 1));
}

/**
 * createUserIdOnRequestSheetをテストする
 */
function createUserIdOnRequestSheetTest() {
  createUserIdOnRequestSheet("eiwa006");
}
