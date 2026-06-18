import { Injectable } from '@nestjs/common';
import { EmployeePoliciesService } from '../../../employees/domain/services/employee-policies.service';

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly employeePoliciesService: EmployeePoliciesService,
  ) {}

  async execute(params: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    await this.employeePoliciesService.checkIsActive(params.email);
    return Promise.resolve({ token: 'valid_token' });
  }
}
