import { mapEventData } from "./form-handler";
import { ILogService } from "./interfaces";
import { getInjectionContainer, isNode, loadApplicationConfig } from "./utils";

loadApplicationConfig().then(() => {
  if (isNode()) {
    global.debugFunction();
  }
});

global.handleFormSubmit = async (submitEvent) => {
  let logService: ILogService | undefined;

  try {
    const injectionContainer = await getInjectionContainer();
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
  const valuesCsvLine = ``;

  const namedValues: { [key: string]: string[] } = {
    "Question One": ["Very nice answer"],
  };

  const submitEvent = {
    values: valuesCsvLine.split(","),
    namedValues,
  } as GoogleAppsScript.Events.SheetsOnFormSubmit;
  global.handleFormSubmit(submitEvent);
};
