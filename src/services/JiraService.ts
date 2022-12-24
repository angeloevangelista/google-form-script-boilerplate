import { ServicesTokens } from "../utils";
import { InjectionContainer } from "./InjectionContainer";
import { IEncodingService, IHttpClient } from "../interfaces";

import { IJiraService } from "../interfaces/jira-service";
import {
  CreateIssueParams,
  CreateIssueResponse,
  JiraError,
  JiraServiceResult,
} from "jira-service-types";

class JiraService implements IJiraService {
  private _httpClient: IHttpClient;
  private _encodingService: IEncodingService;

  constructor(private _injectionContainer: InjectionContainer<ServicesTokens>) {
    this._httpClient = this._injectionContainer.get("IHttpClient");
    this._encodingService = this._injectionContainer.get("IEncodingService");

    this._httpClient.setBaseUrl(
      "https://angeloevangelista.atlassian.net/rest/api/3"
    );

    const username = "ta_procurando_o_que_aqui?";
    const password = "hoje_nao_amigao";

    const encodedToken = this._encodingService.toBase64(`${username}:${password}`)

    this._httpClient.setDefaultHeaders({
      Authorization: `Basic ${encodedToken}`,
    })
  }

  public async createIssue(
    createIssueParams: CreateIssueParams,
  ): Promise<JiraServiceResult<CreateIssueResponse>> {
    try {
      const createIssueResponse = await this._httpClient.post<CreateIssueResponse>(
        "/issue",
        {
          body: createIssueParams,
        },
      );

      const result: JiraServiceResult<CreateIssueResponse> = {
        ok: true,
        error: undefined,
        data: createIssueResponse.data,
      }

      return result;
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  public async deleteIssue(issueKey: string): Promise<JiraServiceResult<undefined>> {
    try {
      await this._httpClient.delete<CreateIssueResponse>(
        `/issue/${issueKey}`,
      );

      const result: JiraServiceResult<undefined> = {
        ok: true,
        error: undefined,
        data: undefined,
      }

      return result
    } catch (error: any) {
      return this._handleError(error);
    }
  }

  private _handleError(error: any): JiraServiceResult<any> {
    let jiraError: JiraError | undefined;

    if ((<any>error).data && (<any>error).statusCode !== 404) {
      jiraError = (<any>error).data
    }

    return {
      ok: false,
      error: jiraError || {
        errorMessages: [], errors: {
          unexpectedError: error
        }
      },
    }
  }
}

export { JiraService }

// // import config from '../config';

// // import { JiraApiServiceTypes } from '../types';
// // import LogService from './log-service';
// // import { DescriptionParagraph, FieldsObject } from '../util/createFieldsObject';
// // import createDescriptionContentFromDescriptionParagraphs from '../util/createDescriptionContentFromDescriptionParagraphs';

// class JiraService {
//   private static _getHeaders() {
//     const basicToken = Utilities.base64Encode(
//       `${config.email.service}:${config.jira.token}`
//     );

//     return {
//       "content-type": "application/json",
//       Accept: "application/json",
//       authorization: `Basic ${basicToken}`,
//     };
//   }

//   public static createIssue(fields: FieldsObject): string {
//     const createIssuePayload = { fields };

//     LogService.log(JSON.stringify(createIssuePayload, null, 2));

//     const createIssueResponse = UrlFetchApp.fetch(
//       `${config.jira.baseUrl}/issue`,
//       {
//         method: "post",
//         contentType: "application/json",
//         headers: this._getHeaders(),
//         payload: JSON.stringify(createIssuePayload),
//       }
//     ).getContentText();

//     LogService.log(createIssueResponse);

//     const { key: issueKey } = JSON.parse(createIssueResponse);

//     return issueKey;
//   }

//   public static deleteIssue(issueKey: string) {
//     UrlFetchApp.fetch(`${config.jira.baseUrl}/issue/${issueKey}`, {
//       method: "delete",
//       contentType: "application/json",
//       headers: this._getHeaders(),
//     }).getContentText();
//   }

//   private static _getUserByEmail(
//     email: string
//   ): JiraApiServiceTypes.JiraUser | undefined {
//     const getUserResponse = UrlFetchApp.fetch(
//       `${config.jira.baseUrl}/user/search?query=${email}`,
//       {
//         method: "get",
//         contentType: "application/json",
//         headers: this._getHeaders(),
//       }
//     ).getContentText();

//     const userCollection = JSON.parse(
//       getUserResponse
//     ) as JiraApiServiceTypes.JiraUser[];

//     return [...userCollection].pop();
//   }

//   public static addUserAsWatcher(userEmail: string, issueKey: string) {
//     try {
//       const user = this._getUserByEmail(userEmail);

//       if (user)
//         UrlFetchApp.fetch(`${config.jira.baseUrl}/issue/${issueKey}/watchers`, {
//           method: "post",
//           headers: this._getHeaders(),
//           payload: `"${user.accountId}"`,
//         }).getContentText();
//     } catch (error) {
//       LogService.log(JSON.stringify(error, null, 2));
//     }
//   }

//   public static getIssue(issueKey: string) {
//     try {
//       const getIssueResponse = UrlFetchApp.fetch(
//         `${config.jira.baseUrl}/issue/${issueKey}`,
//         {
//           method: "get",
//           contentType: "application/json",
//           headers: this._getHeaders(),
//         }
//       ).getContentText();

//       const issue = JSON.parse(
//         getIssueResponse
//       ) as JiraApiServiceTypes.JiraIssue;

//       return issue;
//     } catch (error) {
//       LogService.log(JSON.stringify(error, null, 2));

//       return null;
//     }
//   }

//   public static addDescriptionParagraphs(
//     issueKey: string,
//     descriptionParagraphs: DescriptionParagraph[]
//   ) {
//     try {
//       const issue = this.getIssue(issueKey);

//       if (!issue) return { success: false };

//       const currentDescriptionContentCollection =
//         issue.fields.description.content;

//       const updateIssuePayload = {
//         fields: {
//           description: {
//             type: "doc",
//             version: 1,
//             content: [
//               ...currentDescriptionContentCollection,
//               ...createDescriptionContentFromDescriptionParagraphs(
//                 descriptionParagraphs
//               ),
//             ],
//           },
//         },
//       };

//       LogService.log(JSON.stringify(updateIssuePayload, null, 2));

//       UrlFetchApp.fetch(`${config.jira.baseUrl}/issue/${issueKey}`, {
//         method: "put",
//         headers: this._getHeaders(),
//         payload: JSON.stringify(updateIssuePayload),
//       }).getContentText();

//       return { success: true };
//     } catch (error) {
//       LogService.log(JSON.stringify(error, null, 2));

//       return { success: false };
//     }
//   }
// }

// export { JiraService };
