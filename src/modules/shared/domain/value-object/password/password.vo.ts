import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
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
      return new InvalidParamFormatError('password cannot be only whitespace');
    }
    return null;
  }
}
