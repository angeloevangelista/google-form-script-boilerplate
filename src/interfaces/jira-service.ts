import {
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

  deleteIssue: (issueKey: string) => Promise<JiraServiceResult<undefined>>;

  // addUserAsWatcher: Promise<void>;
  // getIssue: Promise<void>;
  // addDescriptionParagraphs: Promise<void>;
};

export { IJiraService };
