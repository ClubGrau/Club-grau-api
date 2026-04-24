export interface EncrypterPort {
  hash(value: string): Promise<string>;
}
