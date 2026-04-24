import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
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
    expect(passwordOrError).toBeInstanceOf(InvalidParamFormatError);
    expect((passwordOrError as Error).message).toBe(
      'Invalid param format: password cannot be only whitespace',
    );
  });
});
