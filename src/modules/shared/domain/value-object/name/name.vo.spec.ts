import { InvalidParamFormatError } from '../../../../employees/domain/errors/invalid-param-format.error';
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
    expect(nameOrError).toBeInstanceOf(InvalidParamFormatError);
    expect((nameOrError as Error).message).toBe(
      'Invalid param format: name cannot be only whitespace',
    );
  });

  it('should not create an employee with name that is only whitespace', () => {
    const sut = makeSut();
    const employeeOrError = sut.create(' ');
    expect(employeeOrError).toBeInstanceOf(InvalidParamFormatError);
    expect((employeeOrError as Error).message).toBe(
      'Invalid param format: name cannot be only whitespace',
    );
  });
});
