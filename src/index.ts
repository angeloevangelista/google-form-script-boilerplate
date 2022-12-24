import { IJiraService, ILogService } from "./interfaces";
import { getInjectionContainer, isNode } from "./utils";

global.debugFunction = async () => {
  const injectionContainer = await getInjectionContainer();

  const logService = injectionContainer.get<ILogService>("ILogService");
  const jiraService = injectionContainer.get<IJiraService>("IJiraService");

  const createIssueResult = await jiraService.createIssue({
    fields: {
      summary: "Summary",
      project: {
        key: "PDT"
      },
      issuetype: {
        name: "Task"
      },
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Paragraph content"
              }
            ]
          }
        ]
      }
    }
  });

  if (!createIssueResult.ok) {
    logService.log(createIssueResult.error);
    process.exit(1);
  }

  const deleteIssueResult = await jiraService.deleteIssue(createIssueResult.data!.key)

  if (!deleteIssueResult.ok) {
    logService.log(deleteIssueResult);
    process.exit(1);
  }

  return;
};

if (isNode()) {
  global.debugFunction();
}
