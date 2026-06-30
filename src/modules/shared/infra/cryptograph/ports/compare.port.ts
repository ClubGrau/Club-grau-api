export interface ComparePort {
  compare(value: string, hashedValue: string): Promise<boolean>;
}
