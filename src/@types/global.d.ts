interface JiraConfig {
  user: string;
  token: string;
  workspace: string;
}

interface ApplicationConfig {
  jira: JiraConfig;
}

export global {}

declare global {
  var isDebug: boolean = false;
  var applicationConfig: ApplicationConfig;

  function debugFunction(): void;
  function handleFormSubmit(
    submitEvent: GoogleAppsScript.Events.SheetsOnFormSubmit
  ): void;
}
