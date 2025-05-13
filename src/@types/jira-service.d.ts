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
    components?: IssueType[];
    issuetype: IssueType;
    description: IssueDescription;
    status: IssueStatus;
    [key: `customfield_${number}`]: CustomFieldType;
  };

  export type IssueProject = {
    key: string;
  };

  export type IssueType = {
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

  export type JiraDescriptionTodoListContent = {
    type: "text";
    text: string;
  };

  export type JiraDescriptionTodoListItemType = {
    text: string;
    checked?: bool;
  };

  export type IssueDescriptionContent = {
    type:
      | "text"
      | "heading"
      | "rule"
      | "paragraph"
      | "codeBlock"
      | "taskList"
      | "taskItem";
    text?: string;
    content?: IssueDescriptionContent[] | JiraDescriptionTodoListContent[];
    marks?: IssueDescriptionContentMark[];
    attrs?: {
      level?: number;
      language?: JiraCodeBlockLanguagesType;
      state?: "DONE" | "TODO";
    };
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

  export type JiraCodeBlockLanguagesType =
    | "none"
    | "abap"
    | "actionscript"
    | "ada"
    | "applescript"
    | "arduino"
    | "autoit"
    | "c"
    | "c++"
    | "clojure"
    | "coffeescript"
    | "coldfusion"
    | "csharp"
    | "css"
    | "cuda"
    | "d"
    | "dart"
    | "diff"
    | "elixir"
    | "erlang"
    | "fortran"
    | "foxpro"
    | "go"
    | "graphql"
    | "groovy"
    | "haskell"
    | "haxe"
    | "html"
    | "java"
    | "javafx"
    | "javascript"
    | "json"
    | "jsx"
    | "julia"
    | "kotlin"
    | "livescript"
    | "lua"
    | "mathematica"
    | "matlab"
    | "objective-c"
    | "objective-j"
    | "ocaml"
    | "octave"
    | "pascal"
    | "perl"
    | "php"
    | "plaintext"
    | "powershell"
    | "prolog"
    | "puppet"
    | "python"
    | "qml"
    | "r"
    | "racket"
    | "restructuredtext"
    | "ruby"
    | "rust"
    | "sass"
    | "scala"
    | "scheme"
    | "shell"
    | "smalltalk"
    | "splunkspl"
    | "sql"
    | "standardml"
    | "swift"
    | "tcl"
    | "tex"
    | "tsx"
    | "typescript"
    | "vala"
    | "vbnet"
    | "verilog"
    | "vhdl"
    | "visualbasic"
    | "xml"
    | "xquery"
    | "yaml";
}
