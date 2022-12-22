import { isNode } from "./isNode";
import { IHttpClient, ILogService } from "../interfaces";
import { InjectionContainer } from "../services/InjectionContainer";

enum ServicesTokens {
  LogService,
  IHttpClient,
}

async function getInjectionContainer(): Promise<
  InjectionContainer<ServicesTokens>
> {
  const sharedInjectionContainer = new InjectionContainer<ServicesTokens>();

  if (isNode()) {
    const { AxiosHttpService, NativeConsoleLogger } = await import(
      "../services/for-node-modules"
    );

    sharedInjectionContainer
      .register<IHttpClient>(ServicesTokens.IHttpClient, AxiosHttpService)
      .register<ILogService>(ServicesTokens.LogService, NativeConsoleLogger);
  } else {
    const { GoogleScriptsHttpClient, GoogleScriptsLogger } = await import(
      "../services/for-google-modules"
    );

    sharedInjectionContainer
      .register<IHttpClient>(
        ServicesTokens.IHttpClient,
        GoogleScriptsHttpClient
      )
      .register<ILogService>(ServicesTokens.LogService, GoogleScriptsLogger);
  }

  return sharedInjectionContainer;
}

export { getInjectionContainer, ServicesTokens };
