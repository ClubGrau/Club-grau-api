import { InvalidParamFormatError } from '../errors/invalid-param-format.error';
import { InvalidParamNameLengthError } from '../errors/invalid-param-name-length.error';
import { Employee, EmployeeCreateInput } from './Employee';

const makeSut = () => {
  const employeeProps: EmployeeCreateInput = {
    name: 'John Doe',
  };
  const sut = Employee;

  return {
    sut,
    employeeProps,
  };
};

describe('Employee Entity', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Function);
  });

  it('should not create an employee with name that is only whitespace', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create({ ...employeeProps, name: '   ' });
    expect(employeeOrError).toBeInstanceOf(InvalidParamFormatError);
    expect((employeeOrError as Error).message).toBe(
      'Invalid param format: name cannot be only whitespace',
    );
  });

  it('should not create an employee with name shorter than 3 characters', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create({ ...employeeProps, name: 'Jo' });
    expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    expect((employeeOrError as Error).message).toBe(
      'Invalid param format: name cannot be shorter than 3 characters or longer than 255 characters',
    );
  });

  it('should not create an employee with name longer than 255 characters', () => {
    const { sut, employeeProps } = makeSut();
    const name = 'J'.repeat(256);
    const employeeOrError = sut.create({ ...employeeProps, name });
    expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    expect((employeeOrError as Error).message).toBe(
      'Invalid param format: name cannot be shorter than 3 characters or longer than 255 characters',
    );
  });

  it('should create an employee with an auto incremented id', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create(employeeProps);
    expect(employeeOrError).toBeInstanceOf(Employee);
    expect((employeeOrError as Employee).id).toBeDefined();
  });
});
