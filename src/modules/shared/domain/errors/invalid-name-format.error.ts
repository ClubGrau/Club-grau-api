export class InvalidNameFormatError extends Error {
  constructor(message: string) {
    super(`Invalid param format: ${message}`);
    this.name = 'InvalidNameFormatError';
  }
}
