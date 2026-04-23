import { InvalidEmailFormatError } from '../../errors/invalid-email-format.error';
import { Email } from './email.vo';

const makeSut = (): typeof Email => {
  const sut = Email;
  return sut;
};

describe('Email Value Object', () => {
  it('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Function);
  });

  it('should return an error if email value is without @ sign', () => {
    const sut = makeSut();
    const email = 'john.doeexample.com';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: email must contain an "@" symbol',
    );
  });

  it('should return an error if email value has more than 256 characters', () => {
    const sut = makeSut();
    const email = 'a'.repeat(247) + '@example.com';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: email must not exceed 256 characters',
    );
  });

  it('should return an error if email value starts with a dot (.)', () => {
    const sut = makeSut();
    const email = '.john.doe@example.com';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: email must not start with a dot (.)',
    );
  });
});
