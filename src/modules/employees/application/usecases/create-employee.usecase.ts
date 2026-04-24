import { Inject, Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';
import { CheckEmployeeExistenceService } from '../../domain/services/check-employee-existence.service';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';
import { Employee } from '../../domain/entity/Employee';
import type { EncrypterPort } from '../../infra/cryptograph/ports/encrypter.port';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('ENCRYPTER_PORT')
    private readonly encrypter: EncrypterPort,
    private readonly checkEmployeeExistence: CheckEmployeeExistenceService,
  ) {}

  async execute(
    params: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
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
    await this.encrypter.hash(planPasswordValue);

    return Promise.resolve({
      id: 'valid_id',
    });
  }
}
