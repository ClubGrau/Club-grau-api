import { InvalidParamFormatError } from '../errors/invalid-param-format.error';

interface EmployeeProps {
  name: string;
}
export interface EmployeeCreateInput {
  name: string;
}

export class Employee {
  private readonly props: EmployeeProps;

  constructor(props: EmployeeProps) {
    this.props = props;
  }

  static create(input: EmployeeCreateInput): Employee | Error {
    if (input.name.trim() === '') {
      return new InvalidParamFormatError('name cannot be only whitespace');
    }
    return new Employee({ name: input.name });
  }
}
