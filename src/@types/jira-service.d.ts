declare module "jira-service-types" {
  export type CreateIssueParams = {
    key?: string;
    fields: IssueFields;
  };

  export type JiraServiceResult<T> = {
    ok: boolean;
    data?: T;
    error?: JiraError;
  };

  export type JiraError = {
    errorMessages: [];
    errors: { [key: string]: string; unexpectedError?: any };
  };

  export type CustomFieldType =
    | string
    | {
        value: string;
      };

  export type IssueFields = {
    summary: string;
    project: IssueProject;
    components?: Issuetype[];
    issuetype: Issuetype;
    description: IssueDescription;
    status: IssueStatus;
    [key: `customfield_${number}`]: CustomFieldType;
  };

  export type IssueProject = {
    key: string;
  };

  export type Issuetype = {
    name: string;
  };

  export type IssueDescription = {
    type: string;
    version: number;
    content: IssueDescriptionContent[];
  };

  export type IssueStatus = {
    description: string;
    name: string;
    id: string;
  };

  export type IssueDescriptionContent = {
    type: "text" | "heading" | "rule" | "paragraph";
    text?: string;
    content?: IssueDescriptionContent[];
    marks?: IssueDescriptionContentMark[];
    attrs?: {
      level: number;
    };
  };

  export type IssueDescriptionContent = {
    type: string;
    text: string;
    marks?: IssueDescriptionContentMark[];
  };

  export type IssueDescriptionContentMark = {
    type: string;
    attrs?: {
      href: string;
    };
  };

  export type CreateIssueResponse = {
    id: string;
    key: string;
    self: string;
  };

  export type AddUserAsWatcherParams = {
    accountId: string;
    issueKey: string;
  };

  export interface GetJiraUserResponse {
    self: string;
    accountId: string;
    accountType: string;
    emailAddress: string;
    avatarUrls: { [key: string]: string };
    displayName: string;
    active: boolean;
    timeZone: string;
    locale: string;
  }
}
