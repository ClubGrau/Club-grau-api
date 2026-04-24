import { Entity } from '../../../shared/domain/entity/entity';
import { Email } from '../../../shared/domain/value-object/email/email.vo';
import UniqueEntityId from '../../../shared/domain/value-object/id/unique-entity-id.vo';
import { Name } from '../../../shared/domain/value-object/name/name.vo';
import { Password } from '../../../shared/domain/value-object/password/password.vo';

interface EmployeeProps {
  name: Name;
  email: Email;
  password: Password;
}
export interface EmployeeCreateInput {
  name: string;
  email: string;
  password: string;
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

    const emailOrError = Email.create(input.email);
    if (emailOrError instanceof Error) {
      return emailOrError;
    }

    const passwordOrError = Password.create(input.password);
    if (passwordOrError instanceof Error) {
      return passwordOrError;
    }

    return new Employee({
      name: nameOrError,
      email: emailOrError,
      password: passwordOrError,
    });
  }
}
