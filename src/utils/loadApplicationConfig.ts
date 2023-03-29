import { isNode, tryParse } from ".";
import { ApplicationConfig } from "../@types/global";
import { include } from "../gas";

async function loadApplicationConfig() {
  try {
    if (!isNode()) {
      global.applicationConfig = JSON.parse(include("CONFIG"));
      return;
    }

    const [{ readFileSync }, { resolve }] = await Promise.all([
      import("fs"),
      import("path"),
    ]);

    const configFileBuffer = readFileSync(
      resolve(__dirname, "..", "..", "config.json")
    );

    const {
      error,
      success,
      value: applicationConfig,
    } = tryParse<ApplicationConfig>(configFileBuffer.toString());

    if (!success) {
      throw error;
    }

    global.applicationConfig = applicationConfig!;
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
