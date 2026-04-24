import { InvalidPasswordFormatError } from '../../errors/invalid-password-format.error';
import { ValueObject } from '../value-object';

export class Password extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  static create(password: string): Password | Error {
    return new Password(password);
  }

  static validate(password: string): Error | null {
    if (password.trim() === '') {
      return new InvalidPasswordFormatError(
        'password cannot be only whitespace',
      );
    }

    if (password.length < 6) {
      return new InvalidPasswordFormatError(
        'password cannot be shorter than 6 characters',
      );
    }

    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return new InvalidPasswordFormatError(
        'password must have at least one uppercase letter',
      );
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      return new InvalidPasswordFormatError(
        'password must have at least one special character',
      );
    }

    return null;
  }
}
