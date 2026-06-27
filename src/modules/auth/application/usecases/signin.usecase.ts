import { Body, Inject, Injectable } from '@nestjs/common';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { TokenPayloadModel } from '../../domain/models/token-payload';
import type { PasswordValidatorPort } from '../ports/password-validator.port';
import type { SigninModel } from '../../domain/models/signin';
import type { GenerateTokenPort } from '../ports/generate-token.port';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly employeePoliciesService: EmployeePoliciesService,
    @Inject('PASSWORD_VALIDATOR_PORT')
    private readonly passwordValidator: PasswordValidatorPort,
    @Inject('GENERATE_TOKEN_PORT')
    private readonly generateToken: GenerateTokenPort<TokenPayloadModel.Employee>,
  ) {}

  async execute(
    @Body() params: SigninModel.RequestDto,
  ): Promise<SigninModel.ResponseDto> {
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

    const { token } = await this.generateToken.generate({
      id: employee.id,
      email: employee.email,
      role: employee.role,
    });

    return { token };
  }
}
