export global {}

declare global {
  function debugFunction(): void;
  function handleFormSubmit(
    submitEvent: GoogleAppsScript.Events.SheetsOnFormSubmit
  ): void;
}
