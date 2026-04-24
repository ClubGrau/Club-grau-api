export class InvalidPasswordFormatError extends Error {
  constructor(message: string) {
    super(`Invalid param format: ${message}`);
    this.name = 'InvalidPasswordFormatError';
  }
}
