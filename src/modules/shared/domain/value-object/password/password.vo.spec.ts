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
});
