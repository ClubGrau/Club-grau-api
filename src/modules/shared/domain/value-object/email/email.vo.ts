import { InvalidEmailFormatError } from '../../errors/invalid-email-format.error';
import { ValueObject } from '../value-object';

export class Email extends ValueObject<string> {
  private static TEST_STRING =
    /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  static validate(email: string): InvalidEmailFormatError | null {
    const emailRegex = this.TEST_STRING;
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

    if (email.startsWith('.')) {
      return new InvalidEmailFormatError(
        'Invalid email format: email must not start with a dot (.)',
      );
    }

    if (account.length > 64) {
      return new InvalidEmailFormatError(
        'Invalid email format: account part must not exceed 64 characters',
      );
    }

    if (domain.split('.').some((part) => part.length > 63)) {
      return new InvalidEmailFormatError(
        'Invalid email format: domain part must not exceed 63 characters',
      );
    }

    if (!emailRegex.test(email)) {
      return new InvalidEmailFormatError(
        'Invalid email format: email contains invalid characters',
      );
    }

    return null;
  }
}
