import { IJiraService, ILogService } from "./interfaces";
import { getInjectionContainer, isNode } from "./utils";

global.debugFunction = async () => {
  const injectionContainer = await getInjectionContainer();

  const logService = injectionContainer.get<ILogService>("ILogService");
  const jiraService = injectionContainer.get<IJiraService>("IJiraService");

  const userResponse = await jiraService.getUsersByEmail("angeloevan.ane@gmail.com")

  logService.log(userResponse)

  return;
};

if (isNode()) {
  global.debugFunction();
}
