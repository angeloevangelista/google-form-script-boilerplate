declare module "form-handler-types" {
  export enum CustomFieldsMap {}

  export enum IssueType {}

  export enum IssueComponents {}

  export type FormData = {
    requestingUserEmail: string;
    questions: Array<{ question: string; answer: string }>;
  };
}
