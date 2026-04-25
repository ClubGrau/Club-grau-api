export class PasswordNotMatchError extends Error {
  constructor() {
    super('Password and passwordConfirmation do not match');
    this.name = 'PasswordNotMatchError';
  }
}
