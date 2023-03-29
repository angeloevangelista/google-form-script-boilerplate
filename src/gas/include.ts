function include(filename: string) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

export { include };
