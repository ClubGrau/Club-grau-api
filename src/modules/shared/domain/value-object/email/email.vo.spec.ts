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

  it('should call the constructor with the correct value', () => {
    const emailOrError: InvalidEmailFormatError | Email = Email.create(
      'john.doe@example.com',
    );
    if (emailOrError instanceof Error) {
      throw emailOrError;
    }
    expect(emailOrError.getValue()).toBe('john.doe@example.com');
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

  it('should return an error if the account part (before @) is longer than 64 characters', () => {
    const sut = makeSut();
    const email = 'a'.repeat(65) + '@example.com';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: account part must not exceed 64 characters',
    );
  });

  it('should return an error if any domain part (between dots) is longer than 63 characters', () => {
    const sut = makeSut();
    const email = 'john.doe@' + 'a'.repeat(64) + '.com';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: domain part must not exceed 63 characters',
    );
  });

  it('should return an error if email contains invalid characters', () => {
    const sut = makeSut();
    const email = 'a@b.c';
    const emailOrError = sut.validate(email);
    expect(emailOrError).toBeInstanceOf(InvalidEmailFormatError);
    expect((emailOrError as Error).message).toBe(
      'Invalid email format: email contains invalid characters',
    );
  });

  it('should validate return null if no errors found', () => {
    const sut = makeSut();
    const emailOrError = sut.validate('john.doe@example.com');
    expect(emailOrError).toBeNull();
  });

  it('should create a Email instance if valid email is provided', () => {
    const sut = makeSut();
    const emailOrError = sut.create('john.doe@example.com');
    expect(emailOrError).toBeInstanceOf(Email);
    if (emailOrError instanceof Email) {
      expect(typeof emailOrError).toBe('object');
    }
  });
});
