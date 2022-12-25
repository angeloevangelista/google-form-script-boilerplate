import { IJiraService, ILogService } from "./interfaces";
import { getInjectionContainer, isNode } from "./utils";

global.debugFunction = async () => {
  const injectionContainer = await getInjectionContainer();

  const logService = injectionContainer.get<ILogService>("ILogService");
  const jiraService = injectionContainer.get<IJiraService>("IJiraService");

  const deleteResponse = await jiraService.deleteIssue('PDT-33')

  logService.log(deleteResponse);

  // const { data: users } = await jiraService.getUsersByEmail("angeloevan.ane@gmail.com")

  // const createUserResponse = await jiraService.addUserAsWatcher({
  //   accountId: users!.at(0)!.accountId,
  //   issueKey: 'PDT-33',
  // })

  // logService.log(createUserResponse)

  return;
};

if (isNode()) {
  global.debugFunction();
}
