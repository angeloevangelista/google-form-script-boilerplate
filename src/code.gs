function handleFormSubmit(submitEvent) {
  const organizedAnswers = organizeAnswers(submitEvent);

  const fieldsObject = new IssueFieldsHandler()
    .setProject("YOUR_PROJECT_KEY")
    .setIssueType("ISSUE_TYPE")
    .setSummary("ISSUE_TITLE")
    .addDescriptionRuler()
    .openDescriptionParagraph()
    .addBoldText("Some bold text")
    .addNormalText("\n")
    .addNormalText("Normal text")
    .addNormalText("\n")
    .addItalicText("Look, I am pretty Italian... ITALIC! I meant...")
    .closeParagraph()
    .addCodeBlock(
      "console.log('Feel free to also add some code here')",
      "javascript"
    )
    .addTodoList([
      { text: "foo", checked: true },
      { text: "bar", checked: false },
    ])
    .getFieldsObject();

  const createIssueResponse = new JiraService().createIssue({
    fields: fieldsObject,
  });

  if (!createIssueResponse.ok) {
    throw JSON.stringify(createIssueResponse);
  }

  Logger.log(JSON.stringify({ response: createIssueResponse }, null, 2));

  const issueKey = createIssueResponse.data.key;

  sendNotificationEmail({
    to: "someone@email.com",
    issueKey,
  });
}

function organizeAnswers(submitEvent) {
  const formData = {};

  // formData.description = submitEvent.values[2];

  return formData;
}

function sendNotificationEmail({ to, issueKey }) {
  const issueLink = `https://${CONFIG.jira.workspace}.atlassian.net/browse/${issueKey}`;

  const emailSubject = "You got a new issue!";

  const emailContent = [
    "<h3>Hey, mate!</h3>",
    `Just created this for u <a href="${issueLink}" target="_blank">${issueKey}</a>`,
  ].join("\n");

  MailApp.sendEmail({
    to,
    subject: emailSubject,
    htmlBody: emailContent,
  });
}
