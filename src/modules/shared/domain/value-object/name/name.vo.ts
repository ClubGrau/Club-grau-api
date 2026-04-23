import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
import { ValueObject } from '../value-object';

export class Name extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(name: string): Error | Name {
    if (!Name.validate(name)) {
      return new InvalidParamFormatError('name cannot be only whitespace');
    }
    return new Name(name);
  }

  static validate(name: string): boolean {
    if (name.trim() === '') {
      return false;
    }
    return true;
  }
}
