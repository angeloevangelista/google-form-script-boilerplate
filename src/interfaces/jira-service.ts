import {
  AddUserAsWatcherParams,
  CreateIssueParams,
  CreateIssueResponse,
  GetJiraUserResponse,
  JiraServiceResult,
} from "jira-service-types";

interface IJiraService {
  getIssue: (issueKey: string) => Promise<JiraServiceResult<CreateIssueParams>>;

  createIssue: (
    createIssueParams: CreateIssueParams
  ) => Promise<JiraServiceResult<CreateIssueResponse>>;

  getUsersByEmail: (
    userEmail: string
  ) => Promise<JiraServiceResult<GetJiraUserResponse[]>>;

  addUserAsWatcher: (
    addUserAsWatcherParams: AddUserAsWatcherParams
  ) => Promise<JiraServiceResult<undefined>>;

  deleteIssue: (issueKey: string) => Promise<JiraServiceResult<undefined>>;
}

export { IJiraService };
