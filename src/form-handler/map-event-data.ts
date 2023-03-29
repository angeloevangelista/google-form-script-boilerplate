import { FormData } from "form-handler-types";

function mapEventData(
  submitEvent: GoogleAppsScript.Events.SheetsOnFormSubmit
): FormData {
  const { values, namedValues } = submitEvent;

  const formData = {
    requestingUserEmail: values[1],
    questions: Object.keys(namedValues).map((key) => ({
      question: key,
      answer: namedValues[key][0] || "<nothing>",
    })),
  } as FormData;

  return formData;
}

export { mapEventData };
