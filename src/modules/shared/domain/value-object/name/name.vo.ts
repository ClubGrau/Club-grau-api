import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
import { ValueObject } from '../value-object';

export class Name extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(name: string): Error | Name {
    const error = Name.validate(name);
    if (error) {
      return error;
    }

    return new Name(name);
  }

  static validate(name: string): Error | null {
    if (name.trim() === '') {
      return new InvalidParamFormatError('name cannot be only whitespace');
    }
    return null;
  }
}
