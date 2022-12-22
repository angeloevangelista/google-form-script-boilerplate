import { Dictionary } from "./types";

function formatQueryParams(queryParams: Dictionary<string>) {
  return Object.entries(queryParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

export { formatQueryParams };
