export class InvalidParamNameLengthError extends Error {
  constructor() {
    super('Invalid param format: name must be at least 3 characters long');
    this.name = 'InvalidParamNameLengthError';
  }
}
