import { ServicesTokens } from "../utils";
import { InjectionContainer } from "./InjectionContainer";
import { IEncodingService, IHttpClient } from "../interfaces";

import { IJiraService } from "../interfaces/jira-service";
import {
  AddUserAsWatcherParams,
  CreateIssueParams,
  CreateIssueResponse,
  GetJiraUserResponse,
  IssueFields,
  JiraError,
  JiraServiceResult,
  CustomFieldType,
  Issuetype,
  IssueDescriptionContent,
} from "jira-service-types";

class JiraService implements IJiraService {
  private _httpClient: IHttpClient;
  private _encodingService: IEncodingService;

  constructor(private _injectionContainer: InjectionContainer<ServicesTokens>) {
    this._httpClient = this._injectionContainer.get("IHttpClient");
    this._encodingService = this._injectionContainer.get("IEncodingService");

    this._httpClient.setBaseUrl(
      `https://${global.applicationConfig.jira.workspace}.atlassian.net/rest/api/3`
    );

    const { user, token } = global.applicationConfig.jira;

    const encodedToken = this._encodingService.toBase64(`${user}:${token}`);

    this._httpClient.setDefaultHeaders({
      Authorization: `Basic ${encodedToken}`,
    });
  }

  public async getIssue(
    projectKey: string
  ): Promise<JiraServiceResult<CreateIssueParams>> {
    try {
      const getIssueResponse = await this._httpClient.get<CreateIssueParams>(
        `/issue/${projectKey}`
      );

      const result: JiraServiceResult<CreateIssueParams> = {
        ok: true,
        error: undefined,
        data: getIssueResponse.data,
      };

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  public async createIssue(
    createIssueParams: CreateIssueParams
  ): Promise<JiraServiceResult<CreateIssueResponse>> {
    try {
      const createIssueResponse =
        await this._httpClient.post<CreateIssueResponse>("/issue", {
          body: createIssueParams,
        });

      const result: JiraServiceResult<CreateIssueResponse> = {
        ok: true,
        error: undefined,
        data: createIssueResponse.data,
      };

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  public async deleteIssue(
    issueKey: string
  ): Promise<JiraServiceResult<undefined>> {
    try {
      await this._httpClient.delete<CreateIssueResponse>(`/issue/${issueKey}`);

      const result: JiraServiceResult<undefined> = {
        ok: true,
        error: undefined,
        data: undefined,
      };

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  public async getUsersByEmail(
    userEmail: string
  ): Promise<JiraServiceResult<GetJiraUserResponse[]>> {
    try {
      const getUserResponse = await this._httpClient.get<GetJiraUserResponse[]>(
        `/user/search`,
        {
          queryParams: {
            query: userEmail,
          },
        }
      );

      const result: JiraServiceResult<GetJiraUserResponse[]> = {
        ok: true,
        data: getUserResponse.data,
        error: undefined,
      };

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  public async addUserAsWatcher({
    accountId,
    issueKey,
  }: AddUserAsWatcherParams) {
    try {
      await this._httpClient.post<CreateIssueResponse>(
        `/issue/${issueKey}/watchers`,
        {
          body: accountId,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: JiraServiceResult<undefined> = {
        ok: true,
        error: undefined,
        data: undefined,
      };

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  private _handleError(error: any): JiraServiceResult<any> {
    let jiraError: JiraError | undefined;

    if ((<any>error).data && (<any>error).statusCode !== 404) {
      jiraError = (<any>error).data;
    }

    return {
      ok: false,
      error: jiraError || {
        errorMessages: [],
        errors: {
          unexpectedError: error,
        },
      },
    };
  }
}

class IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
  private _issueKey: string | undefined;
  private _fieldsObject: IssueFields;

  constructor(fieldsObject?: IssueFields) {
    this._fieldsObject = {
      description: {
        type: "doc",
        version: 1,
        content: [],
      },
      components: [],
      ...fieldsObject,
    } as IssueFields;
  }

  public get issueKey(): string | undefined {
    return this._issueKey;
  }

  public getFieldsObject(): IssueFields {
    return this._fieldsObject;
  }

  public getCustomField<TCustomFieldType>(
    customField: TCustomFieldsMap
  ): TCustomFieldType {
    return this._fieldsObject[
      `customfield_${Number(customField)}`
    ] as TCustomFieldType;
  }

  public setIssueKey(
    issueKey: string
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._issueKey = issueKey;

    return this;
  }

  public setCustomField(
    customField: TCustomFieldsMap,
    value: CustomFieldType
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._fieldsObject[`customfield_${Number(customField)}`] = value;

    return this;
  }

  public setProject(
    projectKey: string
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._fieldsObject.project = {
      key: projectKey,
    };

    return this;
  }

  public setIssueType(
    issueTypeName: TIssueType
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._fieldsObject.issuetype = {
      name: String(issueTypeName),
    };

    return this;
  }

  public setSummary(
    summary: string
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._fieldsObject.summary = summary;

    return this;
  }

  public addComponent(
    componentName: string
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    if (!this._fieldsObject.components) {
    }

    this._fieldsObject.components?.push({
      name: componentName,
    });

    return this;
  }

  public setComponents(
    ...componentsNames: string[]
  ): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    if (!this._fieldsObject.components) {
    }

    this._fieldsObject.components = componentsNames.map((componentName) => ({
      name: componentName,
    }));

    return this;
  }

  public openDescriptionParagraph(): IssueDescriptionParagraphHandler<
    TCustomFieldsMap,
    TIssueType
  > {
    return new IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType>(
      this
    );
  }

  public addDescriptionRuler(): IssueFieldsHandler<
    TCustomFieldsMap,
    TIssueType
  > {
    this._fieldsObject.description.content.push({
      type: "rule",
    });

    return this;
  }

  /** ❌ Do not use this, it for internal usage only */
  public _addDescriptionContent(content: IssueDescriptionContent) {
    this._fieldsObject.description.content.push(content);
  }
}

class IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType> {
  private _issueFieldsHandler: IssueFieldsHandler<TCustomFieldsMap, TIssueType>;
  private _issueDescriptionContent: IssueDescriptionContent;

  constructor(
    issueFieldsHandler: IssueFieldsHandler<TCustomFieldsMap, TIssueType>
  ) {
    this._issueFieldsHandler = issueFieldsHandler;

    this._issueDescriptionContent = {
      type: "paragraph",
      content: [],
    };
  }

  public closeParagraph(): IssueFieldsHandler<TCustomFieldsMap, TIssueType> {
    this._issueFieldsHandler._addDescriptionContent(
      this._issueDescriptionContent
    );

    return this._issueFieldsHandler;
  }

  public addItalicText(
    text: string
  ): IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType> {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "em" }],
    });

    return this;
  }

  public addBoldText(
    text: string
  ): IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType> {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "strong" }],
    });

    return this;
  }

  public addLink(
    text: string,
    url: string
  ): IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType> {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
      marks: [{ type: "link", attrs: { href: url || " " } }],
    });

    return this;
  }

  public addNormalText(
    text: string
  ): IssueDescriptionParagraphHandler<TCustomFieldsMap, TIssueType> {
    this._issueDescriptionContent.content?.push({
      text: text || " ",
      type: "text",
    });

    return this;
  }
}

export { JiraService, IssueFieldsHandler };
