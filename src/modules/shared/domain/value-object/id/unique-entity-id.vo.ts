import { randomBytes } from 'crypto';
import { InvalidUniqueIdError } from '../../errors/invalid-unique-id.error';
import { ValueObject } from '../value-object';

export default class UniqueEntityId extends ValueObject<string> {
  constructor(readonly id?: string) {
    super(id ?? randomBytes(12).toString('hex'));
    this.validate();
  }

  private validate() {
    const isValid = /^[0-9a-f]{24}$/.test(this.getValue());
    if (!isValid) {
      throw new InvalidUniqueIdError();
    }
  }
}
