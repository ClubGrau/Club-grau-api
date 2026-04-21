import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';

@Injectable()
export class CreateEmployeeUseCase {
  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    return Promise.resolve({
      id: 'valid_id',
    });
  }
}
