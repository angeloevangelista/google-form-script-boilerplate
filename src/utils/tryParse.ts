type TryParseResult<T> = {
  success: boolean;
  value?: T;
  error?: Error;
};

function tryParse<T>(json: string): TryParseResult<T> {
  try {
    return {
      success: true,
      value: JSON.parse(json),
    };
  } catch (error: any) {
    return {
      success: false,
      error,
    };
  }
}

export { tryParse };
