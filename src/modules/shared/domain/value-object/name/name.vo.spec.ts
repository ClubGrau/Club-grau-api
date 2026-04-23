import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
import { InvalidParamNameLengthError } from '../../../../employees/domain/errors/invalid-param-name-length.error';
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

  it('should return error if name is created with whitespace only', () => {
    const sut = makeSut();
    const nameOrError = sut.validate('   ');
    expect(nameOrError).toBeInstanceOf(InvalidParamFormatError);
    expect((nameOrError as Error).message).toBe(
      'Invalid param format: name cannot be only whitespace',
    );
  });

  it('should return error if name is created with length shorter than 3 characters', () => {
    const sut = makeSut();
    const nameOrError = sut.create('Jo');
    expect(nameOrError).toBeInstanceOf(InvalidParamNameLengthError);
    expect((nameOrError as Error).message).toBe(
      'Invalid param format: name cannot be shorter than 3 characters or longer than 255 characters',
    );
  });

  it('should validate return null if no errors found', () => {
    const sut = makeSut();
    const nameOrError = sut.validate('John Doe');
    expect(nameOrError).toBeNull();
  });

  it('should create a Name instance if valid name is provided', () => {
    const sut = makeSut();
    const nameOrError = sut.create('John Doe');
    expect(nameOrError).toBeInstanceOf(Name);
    if (nameOrError instanceof Name) {
      expect(typeof nameOrError).toBe('object');
    }
  });
});
