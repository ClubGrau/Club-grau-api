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
    const nameOrError: Error | Name = Name.create('John Doe');
    if (nameOrError instanceof Error) {
      throw nameOrError;
    }
    expect(nameOrError.getValue()).toBe('John Doe');
  });

  it('should return false if name is created with whitespace only', () => {
    const sut = makeSut();
    const nameOrError = sut.validate('   ');
    expect(nameOrError).toEqual(false);
  });
});
