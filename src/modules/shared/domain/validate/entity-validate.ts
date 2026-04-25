type Result<T> = T | Error;

export function validate<T extends any[]>(
  ...results: { [K in keyof T]: Result<T[K]> }
): T | Error {
  for (const result of results) {
    if (result instanceof Error) {
      return result;
    }
  }
  return results as T;
}
