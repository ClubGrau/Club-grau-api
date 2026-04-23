import { Entity } from '../../../shared/domain/entity/entity';
import UniqueEntityId from '../../../shared/domain/value-object/id/unique-entity-id.vo';
import { Name } from '../../../shared/domain/value-object/name/name.vo';

interface EmployeeProps {
  name: Name;
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
    const nameOrError = Name.create(input.name);
    if (nameOrError instanceof Error) {
      return nameOrError;
    }

    return new Employee({ name: nameOrError });
  }
}
