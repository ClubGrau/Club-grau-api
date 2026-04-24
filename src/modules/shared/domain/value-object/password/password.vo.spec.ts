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
});
