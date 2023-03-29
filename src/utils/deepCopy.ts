function deepCopy<T>(obj: Object): T {
  return JSON.parse(JSON.stringify(obj));
}

export { deepCopy };
