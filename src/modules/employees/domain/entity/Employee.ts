import { Entity } from '../../../shared/domain/entity/entity';
import UniqueEntityId from '../../../shared/domain/value-object/id/unique-entity-id.vo';
import Name from '../../../shared/domain/value-object/name/name.vo';
import Email from '../../../shared/domain/value-object/email/email.vo';
import Password from '../../../shared/domain/value-object/password/password.vo';
import Nif from '../../../shared/domain/value-object/nif/nif.vo';
import { EmployeeModel } from '../models/employee';
import { InvalidParamError } from '../errors/invalid-param.error';

interface EmployeeProps {
  name: Name;
  email: Email;
  password: Password;
  nif?: Nif | null;
  role: EmployeeModel.Role;
}

export class Employee extends Entity<EmployeeProps> {
  constructor(
    public readonly props: EmployeeProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  static create(input: EmployeeModel.EntityCreateInput): Employee | Error {
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

    const nifOrError = input.nif ? Nif.create(input.nif) : null;
    if (nifOrError instanceof Error) {
      return nifOrError;
    }

    if (
      !input.role ||
      !Object.values(EmployeeModel.Role).includes(input.role)
    ) {
      return new InvalidParamError('role');
    }

    return new Employee({
      name: nameOrError,
      email: emailOrError,
      password: passwordOrError,
      nif: nifOrError,
      role: input.role,
    });
  }
}

const employee1 = Employee.create({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'P@ssword',
  role: EmployeeModel.Role.Admin,
  nif: 123456789,
});

if (employee1 instanceof Employee) {
  console.log('Employee created successfully:', employee1.toJSON());
}
