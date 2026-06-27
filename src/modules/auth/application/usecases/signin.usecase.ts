import { Inject, Injectable } from '@nestjs/common';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';
import type { PasswordValidatorPort } from '../ports/password-validator.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly employeePoliciesService: EmployeePoliciesService,
    @Inject('PASSWORD_VALIDATOR_PORT')
    private readonly passwordValidator: PasswordValidatorPort,
  ) {}

  async execute(params: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    const employeeOrError = await this.employeePoliciesService.checkIsActive(
      params.email,
    );
    if (employeeOrError instanceof Error) throw employeeOrError;

    const employee = employeeOrError;

    const isPasswordValid = await this.passwordValidator.compare(
      params.password,
      employee.password,
    );
    if (!isPasswordValid) throw new InvalidCredentialsError();

    return { token: 'valid_token' };
  }
}
