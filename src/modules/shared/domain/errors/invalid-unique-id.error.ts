export class InvalidUniqueIdError extends Error {
  constructor() {
    super('Invalid unique ID');
    this.name = 'InvalidUniqueIdError';
  }
}
