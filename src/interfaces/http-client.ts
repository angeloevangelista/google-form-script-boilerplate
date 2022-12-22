import { Dictionary } from "../utils/types";

type RequestOptions = {
  queryParams?: Dictionary<string>;
  body?: object;
  headers?: Dictionary<string>;
};

type RequestResult<T> = {
  statusCode: number;
  message?: string;
  responseHeaders: Dictionary<string>;
  data?: T;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface IHttpClient {
  setBaseUrl(baseUrl: string): void;
  setDefaultHeaders(headers: Dictionary<string>): void;

  get<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>>;
  post<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>>;
  put<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>>;
  delete<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>>;
}

export { IHttpClient, RequestResult, RequestOptions };
