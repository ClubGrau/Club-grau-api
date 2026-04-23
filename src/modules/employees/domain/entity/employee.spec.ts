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

  it('should return error if name is only whitespace', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create({ ...employeeProps, name: '   ' });
    expect(employeeOrError).toBeInstanceOf(Error);
  });
});
