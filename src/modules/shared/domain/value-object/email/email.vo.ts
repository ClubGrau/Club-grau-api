import { InvalidEmailFormatError } from '../../errors/invalid-email-format.error';
import { ValueObject } from '../value-object';

export class Email extends ValueObject<string> {
  static validate(email: string): InvalidEmailFormatError | null {
    const [account, domain] = email.split('@');

    if (!account || !domain) {
      return new InvalidEmailFormatError(
        'Invalid email format: email must contain an "@" symbol',
      );
    }

    if (email.length > 256) {
      return new InvalidEmailFormatError(
        'Invalid email format: email must not exceed 256 characters',
      );
    }

    return null;
  }
}
