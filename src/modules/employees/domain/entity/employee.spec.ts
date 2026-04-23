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

  it('should create an employee with an auto incremented id', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create(employeeProps);
    expect(employeeOrError).toBeInstanceOf(Employee);
    expect((employeeOrError as Employee).id).toBeDefined();
  });

  describe('Employee name validation', () => {
    it('should return error if name is only whitespace', () => {
      const { sut, employeeProps } = makeSut();
      const employeeOrError = sut.create({ ...employeeProps, name: '   ' });
      expect(employeeOrError).toBeInstanceOf(InvalidParamFormatError);
    });

    it('should return error if name is shorter than 3 characters', () => {
      const { sut, employeeProps } = makeSut();
      const employeeOrError = sut.create({ ...employeeProps, name: 'Jo' });
      expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    });

    it('should return error if name is longer than 255 characters', () => {
      const { sut, employeeProps } = makeSut();
      const longName = 'J'.repeat(256);
      const employeeOrError = sut.create({ ...employeeProps, name: longName });
      expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    });

    it('should create an employee if name is valid', () => {
      const { sut, employeeProps } = makeSut();
      const name = 'John Doe';
      const employeeOrError = sut.create({ ...employeeProps, name });
      expect(employeeOrError).toBeInstanceOf(Employee);
    });
  });
});
