import { Name } from './name.vo';

const makeSut = (): typeof Name => {
  const sut = Name;
  return sut;
};

describe('Name Value Object', () => {
  it('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Function);
  });

  it('should call the constructor with the correct value', () => {
    const sut = makeSut();
    const name = new sut('John Doe');
    expect(name.getValue()).toBe('John Doe');
  });
});
