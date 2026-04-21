import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';

@Injectable()
export class CreateEmployeeUseCase {
  async execute(
    params: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    const { password, passwordConfirmation } = params;
    if (password !== passwordConfirmation) {
      throw new Error('Password and passwordConfirmation do not match');
    }
    return Promise.resolve({
      id: 'valid_id',
    });
  }
}
