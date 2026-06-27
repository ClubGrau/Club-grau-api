import { Inject, Injectable } from '@nestjs/common';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';
import type { PasswordValidatorPort } from '../ports/password-validator.port';

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

    await this.passwordValidator.compare(params.password, employee.password);
    return { token: 'valid_token' };
  }
}
