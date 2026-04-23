import { Entity } from '../../../shared/domain/entity/entity';
import UniqueEntityId from '../../../shared/domain/value-object/id/unique-entity-id.vo';
import { InvalidParamFormatError } from '../errors/invalid-param-format.error';
import { InvalidParamNameLengthError } from '../errors/invalid-param-name-length.error';

interface EmployeeProps {
  name: string;
}
export interface EmployeeCreateInput {
  name: string;
}

export class Employee extends Entity<EmployeeProps> {
  constructor(
    public readonly props: EmployeeProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
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
