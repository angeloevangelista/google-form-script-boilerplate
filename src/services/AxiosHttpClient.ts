import axios, { AxiosInstance, AxiosError } from "axios";

import { IHttpClient, RequestOptions, RequestResult } from "../interfaces";

import { Dictionary } from "../utils/types";

class AxiosHttpClient implements IHttpClient {
  private _apiInstance: AxiosInstance;

  /**
   *
   * @param baseUrl Url will be used as prefix in all requests
   */
  constructor(baseUrl?: string) {
    this._apiInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  /**
   *
   * @param baseUrl Url will be used as prefix in all requests
   */
  public setBaseUrl(baseUrl: string): void {
    this._apiInstance.defaults.baseURL = baseUrl;
  }

  /**
   *
   * @param headers Headers will be used in all requests
   */
  public setDefaultHeaders(headers: Dictionary<string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      this._apiInstance.defaults.headers.common[key] = value;
    });
  }

  public async get<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    try {
      const response = await this._apiInstance.get<T>(url, {
        headers: options?.headers,
        params: options?.queryParams,
      });

      return {
        statusCode: response.status,
        data: response.data,
        message: response.statusText,
        responseHeaders: Object.entries(response.headers).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };
    } catch (error: any) {
      if (error instanceof AxiosError) return this._handleAxiosError<T>(error);

      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: Object.entries(error.response?.headers || {}).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };

      return Promise.reject(rejectObject);
    }
  }

  public async post<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    try {
      const response = await this._apiInstance.post<T>(url, {
        headers: options?.headers,
        data: options?.body,
        params: options?.queryParams,
      });

      return {
        statusCode: response.status,
        data: response.data,
        message: response.statusText,
        responseHeaders: Object.entries(response.headers).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };
    } catch (error: any) {
      if (error instanceof AxiosError) return this._handleAxiosError<T>(error);

      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: Object.entries(error.response?.headers || {}).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };

      return Promise.reject(rejectObject);
    }
  }

  public async put<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    try {
      const response = await this._apiInstance.put<T>(url, {
        headers: options?.headers,
        data: options?.body,
        params: options?.queryParams,
      });

      return {
        statusCode: response.status,
        data: response.data,
        message: response.statusText,
        responseHeaders: Object.entries(response.headers).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };
    } catch (error: any) {
      if (error instanceof AxiosError) return this._handleAxiosError<T>(error);

      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: Object.entries(error.response?.headers || {}).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };

      return Promise.reject(rejectObject);
    }
  }

  public async delete<T>(
    url: string,
    options?: RequestOptions | undefined
  ): Promise<RequestResult<T>> {
    try {
      const response = await this._apiInstance.delete<T>(url, {
        headers: options?.headers,
        data: options?.body,
        params: options?.queryParams,
      });

      return {
        statusCode: response.status,
        data: response.data,
        message: response.statusText,
        responseHeaders: Object.entries(response.headers).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };
    } catch (error: any) {
      if (error instanceof AxiosError) return this._handleAxiosError<T>(error);

      const rejectObject: RequestResult<T> = {
        statusCode: 0,
        data: undefined,
        message: error.message,
        responseHeaders: Object.entries(error.response?.headers || {}).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        ),
      };

      return Promise.reject(rejectObject);
    }
  }

  private _handleAxiosError<T>(
    error: AxiosError<T>
  ): Promise<RequestResult<T>> {
    const rejectObject: RequestResult<T> = {
      statusCode: error.response?.status || 500,
      data: error.response?.data,
      message: error.response?.statusText,
      responseHeaders: Object.entries(error.response?.headers || {}).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      ),
    };

    return Promise.reject(rejectObject);
  }
}

export { AxiosHttpClient as AxiosHttpService };
