export class InactiveEmployeeError extends Error {
  constructor() {
    super('Existent employee is inactive');
    this.name = 'InactiveEmployeeError';
  }
}
