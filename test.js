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
 * getEventInfo()のテストをする
 */
function getEventInfoTest() {
  console.log(getEventInfo());
}

/**
 * getEventId()のテストをする
 */
function getEventIdTest() {
  let eventIdList = getEventId("eiwa001");
  console.log(eventIdList[0]);
}

/**
 * eventRequestChangeのテストをする
 */
function eventRequestChangeTest() {
  eventRequestChange("eiwa001", 3);
}
/*
 * submitUserDataをテストする
 */
function submitUserDataTest() {
  let userDataArray = ["eiwa006", "eiwa", "a", "a", "a", "a"];
  submitUserData(userDataArray);
}
