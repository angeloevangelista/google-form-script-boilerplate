import { isNode } from "./isNode";
import { JiraService } from "../services";
import { InjectionContainer } from "../services/InjectionContainer";
import { IEncodingService, IHttpClient, IJiraService, ILogService } from "../interfaces";

type ServicesTokens = (
  "ILogService" |
  "IHttpClient" |
  "IEncodingService" |
  "IJiraService"
)

async function getInjectionContainer(): Promise<
  InjectionContainer<ServicesTokens>
> {
  const sharedInjectionContainer = new InjectionContainer<ServicesTokens>();

  sharedInjectionContainer.register<IJiraService>(
    "IJiraService",
    JiraService
  );

  if (isNode()) {
    const {
      AxiosHttpService,
      NativeConsoleLogger,
      NativeEncodingService,
    } = await import("../services/for-node-modules");

    sharedInjectionContainer
      .register<IHttpClient>("IHttpClient", AxiosHttpService)
      .register<ILogService>("ILogService", NativeConsoleLogger)
      .register<IEncodingService>("IEncodingService", NativeEncodingService);
  } else {
    const {
      GoogleScriptsLogger,
      GoogleScriptsHttpClient,
      GoogleScriptsEncodingService,
    } = await import(
      "../services/for-google-modules"
    );

    sharedInjectionContainer
      .register<IHttpClient>(
        "IHttpClient",
        GoogleScriptsHttpClient
      )
      .register<IEncodingService>(
        "IEncodingService",
        GoogleScriptsEncodingService,
      )
      .register<ILogService>("ILogService", GoogleScriptsLogger);
  }

  return sharedInjectionContainer;
}

export { getInjectionContainer, ServicesTokens };
