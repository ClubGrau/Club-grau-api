import { InvalidNameFormatError } from '../../errors/invalid-name-format.error';
import { ValueObject } from '../value-object';

export default class Name extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(name: string): InvalidNameFormatError | Name {
    const error = Name.validate(name);
    if (error) {
      return error;
    }

    return new Name(name);
  }

  static validate(name: string): InvalidNameFormatError | null {
    if (name.trim() === '') {
      return new InvalidNameFormatError('name cannot be only whitespace');
    }

    if (name.length < 3 || name.length > 255) {
      return new InvalidNameFormatError(
        'name cannot be shorter than 3 characters or longer than 255 characters',
      );
    }
    return null;
  }
}
