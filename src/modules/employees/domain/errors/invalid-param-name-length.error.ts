export class InvalidParamNameLengthError extends Error {
  constructor() {
    super(
      'Invalid param format: name cannot be shorter than 3 characters or longer than 255 characters',
    );
    this.name = 'InvalidParamNameLengthError';
  }
}
