import { isNode } from "./isNode";
import { JiraService } from "../services";
import { InjectionContainer } from "../services/InjectionContainer";
import {
  IEncodingService,
  IHttpClient,
  IJiraService,
  ILogService,
} from "../interfaces";
import { IEmailService } from "../interfaces/email-service";

type ServicesTokens =
  | "ILogService"
  | "IHttpClient"
  | "IEncodingService"
  | "IJiraService"
  | "IEmailService";

async function getInjectionContainer(): Promise<
  InjectionContainer<ServicesTokens>
> {
  const sharedInjectionContainer = new InjectionContainer<ServicesTokens>();

  sharedInjectionContainer.register<IJiraService>("IJiraService", JiraService);

  if (isNode()) {
    const {
      AxiosHttpService,
      NativeConsoleLogger,
      NativeEncodingService,
      FakeEmailService,
    } = await import("../services/for-node-modules");

    sharedInjectionContainer
      .register<IHttpClient>("IHttpClient", AxiosHttpService)
      .register<ILogService>("ILogService", NativeConsoleLogger)
      .register<IEncodingService>("IEncodingService", NativeEncodingService)
      .register<IEmailService>("IEmailService", FakeEmailService);
  } else {
    const {
      GoogleScriptsLogger,
      GoogleScriptsHttpClient,
      GoogleScriptsEncodingService,
      GoogleScriptsEmailService,
    } = await import("../services/for-google-modules");

    sharedInjectionContainer
      .register<IHttpClient>("IHttpClient", GoogleScriptsHttpClient)
      .register<IEncodingService>(
        "IEncodingService",
        GoogleScriptsEncodingService
      )
      .register<ILogService>("ILogService", GoogleScriptsLogger)
      .register<IEmailService>("IEmailService", GoogleScriptsEmailService);
  }

  return sharedInjectionContainer;
}

export { getInjectionContainer, ServicesTokens };
