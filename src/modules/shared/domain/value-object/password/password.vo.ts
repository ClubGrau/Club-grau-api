import { ValueObject } from '../value-object';

export class Password extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  static create(password: string): Password | Error {
    return new Password(password);
  }
}
