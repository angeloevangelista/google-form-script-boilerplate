import { mapEventData } from "./form-handler";
import { ILogService } from "./interfaces";
import * as utils from "./utils";

utils.loadApplicationConfig().then(() => {
  if (utils.isNode()) {
    global.debugFunction();
  }
});

global.handleFormSubmit = async (submitEvent) => {
  let logService: ILogService | undefined;

  try {
    const injectionContainer = await utils.getInjectionContainer();
    logService = injectionContainer.get<ILogService>("ILogService");

    const formData = mapEventData(submitEvent);

    logService.json({
      formData,
      applicationConfig: global.applicationConfig,
    });
  } catch (error: any) {
    logService?.log(error.message);

    throw new Error(error.message);
  }
};

global.debugFunction = async () => {
  const valuesCsvLine = "".split(",");
  // const valuesCsvLine = await utils.readDebugCsv(
  //   "file.csv"
  // );

  const namedValues: { [key: string]: string[] } = {
    "Question One": ["Very nice answer"],
  };

  const submitEvent = {
    values: valuesCsvLine,
    namedValues,
  } as GoogleAppsScript.Events.SheetsOnFormSubmit;
  global.handleFormSubmit(submitEvent);
};
