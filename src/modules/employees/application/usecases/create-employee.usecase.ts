import { Inject, Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';
import { CheckEmployeeExistenceService } from '../../domain/services/check-employee-existence.service';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';
import { Employee } from '../../domain/entity/Employee';
import type { EncrypterPort } from '../../infra/cryptograph/ports/encrypter.port';
import type { CreateEmployeeRepositoryPort } from '../ports/create-employee.repository.port';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('ENCRYPTER_PORT')
    private readonly encrypter: EncrypterPort,
    @Inject('CREATE_EMPLOYEE_REPOSITORY_PORT')
    private readonly createEmployeeRepository: CreateEmployeeRepositoryPort,
    private readonly checkEmployeeExistence: CheckEmployeeExistenceService,
  ) {}

  async execute(
    params: EmployeeModel.CreateRequestDto,
  ): Promise<EmployeeModel.CreateResponseDto> {
    const { password, passwordConfirmation } = params;
    if (password !== passwordConfirmation) {
      throw new PasswordNotMatchError();
    }

    const isExistOrInactive = await this.checkEmployeeExistence.check(
      params.email,
    );
    if (isExistOrInactive instanceof Error) {
      throw isExistOrInactive;
    }

    const employeeOrError = Employee.create({
      name: params.name,
      email: params.email,
      role: params.role,
      password: params.password,
      nif: params.nif,
    });

    if (employeeOrError instanceof Error) {
      throw employeeOrError;
    }

    const planPasswordValue = employeeOrError.props.password.getValue();
    const hashedPassword = await this.encrypter.hash(planPasswordValue);

    const employee = {
      ...employeeOrError.toJSON(),
      password: hashedPassword,
    };

    const { id } = await this.createEmployeeRepository.create(employee);

    return { id };
  }
}
