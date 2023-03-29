import { isNode } from ".";
import { ApplicationConfig } from "../@types/global";
import { include } from "../gas";

async function loadApplicationConfig() {
  try {
    if (!isNode()) {
      global.applicationConfig = JSON.parse(include("CONFIG"));
      return;
    }

    const configFile = await import("../../config.json");

    global.applicationConfig = (<any>configFile.default) as ApplicationConfig;
  } catch (error: any) {
    const logger = global.Logger || global.console;

    logger.log(
      JSON.stringify(
        {
          message: "An error ocurred while loading configuration",
          error: error.message,
        },
        null,
        2
      )
    );
  }
}

export { loadApplicationConfig };
