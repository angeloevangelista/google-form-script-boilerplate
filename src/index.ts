import { ILogService } from "./interfaces";
import { getInjectionContainer, isNode, ServicesTokens } from "./utils";

global.debugFunction = async () => {
  const injectionContainer = await getInjectionContainer();

  const logService = injectionContainer.get<ILogService>(
    ServicesTokens.LogService
  );

  logService.log("Injection works!");

  return;
};

if (isNode()) {
  global.debugFunction();
}
