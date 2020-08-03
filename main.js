function doGet() {
  return HtmlService.createTemplateFromFile(`login`).evaluate().setTitle("ログイン");
}

function include(css) {
  return HtmlService.createHtmlOutputFromFile(css).getContent();
} 


