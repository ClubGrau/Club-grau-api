export class InvalidEmailFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEmailFormatError';
  }
}
