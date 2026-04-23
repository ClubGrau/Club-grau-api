import { InvalidParamFormatError } from '../errors/invalid-param-format.error';
import { InvalidParamNameLengthError } from '../errors/invalid-param-name-length.error';

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

    if (input.name.length < 3 || input.name.length > 255) {
      return new InvalidParamNameLengthError();
    }

    return new Employee({ name: input.name });
  }
}
