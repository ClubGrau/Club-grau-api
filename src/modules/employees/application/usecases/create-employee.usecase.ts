import { Inject, Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';
import type { FindActiveEmployeeByEmail } from '../ports/find-active-employee-by-email.port';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('FIND_ACTIVE_EMPLOYEE_BY_EMAIL')
    private readonly findActiveEmployeeByEmail: FindActiveEmployeeByEmail,
  ) {}

  async execute(
    params: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    const { password, passwordConfirmation } = params;
    if (password !== passwordConfirmation) {
      throw new Error('Password and passwordConfirmation do not match');
    }

    const isEmployeeExist = await this.findActiveEmployeeByEmail.isExist(
      params.email,
    );

    if (isEmployeeExist) {
      throw new Error('Employee already exists');
    }
    return Promise.resolve({
      id: 'valid_id',
    });
  }
}
