export class InvalidParamFormatError extends Error {
  constructor(message: string) {
    super(`Invalid param format: ${message}`);
    this.name = 'InvalidParamFormatError';
  }
}
