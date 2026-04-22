export class ExistEmployeeError extends Error {
  constructor() {
    super('Employee already exists');
    this.name = 'ExistEmployeeError';
  }
}
