import { Entity } from '../../../shared/domain/entity/entity';
import UniqueEntityId from '../../../shared/domain/value-object/id/unique-entity-id.vo';
import Name from '../../../shared/domain/value-object/name/name.vo';
import Email from '../../../shared/domain/value-object/email/email.vo';
import Password from '../../../shared/domain/value-object/password/password.vo';
import Nif from '../../../shared/domain/value-object/nif/nif.vo';
import { EmployeeModel } from '../models/employee';
import { InvalidParamError } from '../errors/invalid-param.error';
import { validate } from '../../../shared/domain/validate/entity-validate';

interface EmployeeProps {
  name: Name;
  email: Email;
  password: Password;
  nif?: Nif | null;
  role: EmployeeModel.Role;
  isActive: boolean;
}

export class Employee extends Entity<EmployeeProps> {
  private constructor(
    readonly props: EmployeeProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  static create(input: EmployeeModel.EntityCreateInput): Employee | Error {
    if (
      !input.role ||
      !Object.values(EmployeeModel.Role).includes(input.role)
    ) {
      return new InvalidParamError('role');
    }

    const result = validate(
      Name.create(input.name),
      Email.create(input.email),
      Password.create(input.password),
      input.nif !== undefined && input.nif !== null
        ? Nif.create(input.nif)
        : null,
    );
    if (result instanceof Error) return result;
    const [name, email, password, nif] = result;

    const optionalProps = {
      isActive: input.isActive ?? true,
    };

    return new Employee({
      name,
      email,
      password,
      nif,
      role: input.role,
      ...optionalProps,
    });
  }
}
