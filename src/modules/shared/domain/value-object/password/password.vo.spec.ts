import { InvalidPasswordFormatError } from '../../errors/invalid-password-format.error';
import { Password } from './password.vo';

const makeSut = () => {
  const sut = Password;
  return sut;
};

describe('Password Value Object', () => {
  it('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Function);
  });

  it('should call the constructor with the correct value', () => {
    const passwordOrError: Error | Password = Password.create('P@ssword');
    if (passwordOrError instanceof Error) {
      throw passwordOrError;
    }
    expect(passwordOrError.getValue()).toBe('P@ssword');
  });

  it('should return error if password is created with whitespace only', () => {
    const sut = makeSut();
    const passwordOrError = sut.validate('   ');
    expect(passwordOrError).toBeInstanceOf(InvalidPasswordFormatError);
    expect((passwordOrError as Error).message).toBe(
      'Invalid param format: password cannot be only whitespace',
    );
  });

  it('should return an error if password is shorter than 6 characters', () => {
    const sut = makeSut();
    const passwordOrError = sut.validate('P@ss');
    expect(passwordOrError).toBeInstanceOf(InvalidPasswordFormatError);
    expect((passwordOrError as Error).message).toBe(
      'Invalid param format: password cannot be shorter than 6 characters',
    );
  });

  it('should return an error if password does not have one uppercase letter at least', () => {
    const sut = makeSut();
    const passwordOrError = sut.validate('p@ssword');
    expect(passwordOrError).toBeInstanceOf(InvalidPasswordFormatError);
    expect((passwordOrError as Error).message).toBe(
      'Invalid param format: password must have at least one uppercase letter',
    );
  });

  it('should return an error if password does not have a special character at least', () => {
    const sut = makeSut();
    const passwordOrError = sut.validate('Password');
    expect(passwordOrError).toBeInstanceOf(InvalidPasswordFormatError);
    expect((passwordOrError as Error).message).toBe(
      'Invalid param format: password must have at least one special character',
    );
  });

  it('should return null if password is valid', () => {
    const sut = makeSut();
    const passwordOrError = sut.validate('P@ssword');
    expect(passwordOrError).toBeNull();
  });
});
