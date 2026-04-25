export class InvalidNifFormatError extends Error {
  constructor() {
    super('Invalid param format: nif must be a 9-digit number');
    this.name = 'InvalidNifFormatError';
  }
}
