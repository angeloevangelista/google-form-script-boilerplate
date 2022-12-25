import {
  AddUserAsWatcherParams,
  CreateIssueParams,
  CreateIssueResponse,
  GetJiraUserResponse,
  JiraServiceResult,
} from "jira-service-types";

type IJiraService = {
  createIssue: (createIssueParams: CreateIssueParams) =>
    Promise<JiraServiceResult<CreateIssueResponse>>;

  getUsersByEmail: (userEmail: string) =>
    Promise<JiraServiceResult<GetJiraUserResponse[]>>;

  addUserAsWatcher: (addUserAsWatcherParams: AddUserAsWatcherParams) =>
    Promise<JiraServiceResult<undefined>>;

  deleteIssue: (issueKey: string) => Promise<JiraServiceResult<undefined>>;

  // getIssue: Promise<void>;
  // addDescriptionParagraphs: Promise<void>;
};

export { IJiraService };
