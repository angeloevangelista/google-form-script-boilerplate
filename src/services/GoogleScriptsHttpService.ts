import { Dictionary } from "../utils/types";
import { formatQueryParams, ServicesTokens, tryParse } from "../utils";
import { IHttpClient, RequestOptions, RequestResult } from "../interfaces";
import { InjectionContainer } from "./InjectionContainer";

class GoogleScriptsHttpClient implements IHttpClient {
  private _baseUrl?: string;
  private _defaultHeaders: Dictionary<string> = {
    "Content-Type": "application/json",
  };

  /**
   *
   * @param baseUrl Url will be used as prefix in all requests
   */
  constructor(
    private _injectionContainer: InjectionContainer<ServicesTokens>,
    baseUrl?: string
  ) {
    if (baseUrl) this._baseUrl = baseUrl;
  }

  /**
   *
   * @param baseUrl Url will be used as prefix in all requests
   */
  public setBaseUrl(baseUrl: string): void {
    this._baseUrl = baseUrl;
  }

  /**
   *
   * @param headers Headers will be used in all requests
   */
  public setDefaultHeaders(headers: Dictionary<string>): void {
    this._defaultHeaders = { ...this._defaultHeaders, ...headers };
  }

  public async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<RequestResult<T>> {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse | undefined;

    url = this._baseUrl ? this._baseUrl + url : url;

    if (options?.queryParams) {
      url += "?" + formatQueryParams(options.queryParams);
    }

    try {
      response = UrlFetchApp.fetch(url, {
        method: "get",
        headers: { ...this._defaultHeaders, ...options?.headers },
      });
    } catch (error: any) {
      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: {},
      };

      return Promise.reject(rejectObject);
    }

    if (!response) {
      const rejectObject: RequestResult<T> = {
        data: undefined,
        message: "Could not get response from server",
        responseHeaders: {},
        statusCode: 0,
      };

      return Promise.reject(rejectObject);
    }

    const responseHeaders: Dictionary<string> = Object.entries(
      response.getHeaders()
    ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const responseTextContent = response.getContentText();

    const { success: parseSuccess, value: parsedResponse } =
      tryParse<T>(responseTextContent);

    const responseData = parseSuccess ? parsedResponse : responseTextContent;

    return {
      data: responseData as T,
      message: "ok",
      responseHeaders: responseHeaders,
      statusCode: response.getResponseCode(),
    };
  }

  public async post<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    return this._sharedRequestWithBody("post", url, options);
  }

  public async put<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    return this._sharedRequestWithBody("put", url, options);
  }

  public async delete<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    return this._sharedRequestWithBody<T>("delete", url, options);
  }

  private async _sharedRequestWithBody<T>(
    method: "post" | "delete" | "put",
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse | undefined;

    url = this._baseUrl ? this._baseUrl + url : url;

    if (options?.queryParams) {
      url += "?" + formatQueryParams(options.queryParams);
    }

    try {
      response = UrlFetchApp.fetch(url, {
        method,
        headers: { ...this._defaultHeaders, ...options?.headers },
        payload: options?.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error: any) {
      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: {},
      };

      return Promise.reject(rejectObject);
    }

    if (!response) {
      const rejectObject: RequestResult<T> = {
        data: undefined,
        message: "Could not get response from server",
        responseHeaders: {},
        statusCode: 0,
      };

      return Promise.reject(rejectObject);
    }

    const responseHeaders: Dictionary<string> = Object.entries(
      response.getHeaders()
    ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const responseTextContent = response.getContentText();

    const {
      success: parseSuccess,
      value: parsedResponse,
      error: parseError,
    } = tryParse<T>(responseTextContent);

    if (!parseSuccess) {
      const rejectObject: RequestResult<T> = {
        data: undefined,
        message: parseError?.message,
        responseHeaders: responseHeaders,
        statusCode: response.getResponseCode(),
      };

      return Promise.reject(rejectObject);
    }

    return {
      data: parsedResponse,
      message: "ok",
      responseHeaders: responseHeaders,
      statusCode: response.getResponseCode(),
    };
  }
}

export { GoogleScriptsHttpClient };
