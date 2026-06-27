export interface GenerateTokenPort<T extends object> {
  generate(payload: T): Promise<string>;
}
