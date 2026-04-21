import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';

@Injectable()
export class CreateEmployeeUseCase {
  async execute(
    request: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    console.log(request);
    return Promise.resolve({
      id: 'valid_id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'P@ssword123',
      isActive: true,
      nif: 123456789,
      createdAt: '2024-01-01T00:00:00.000Z',
      deactivatedAt: null,
    });
  }
}
