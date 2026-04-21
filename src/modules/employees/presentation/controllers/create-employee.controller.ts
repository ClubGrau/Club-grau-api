import { Body, Controller, Post } from '@nestjs/common';
import { BadRequest } from '../http-exceptions/bad-request';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import type { EmployeeModel } from '../../domain/models/employee';

@Controller('employee')
export class CreateEmployeeController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  async handle(@Body() request: EmployeeModel.CreateEmployeeRequestDto) {
    const requiredFields = [
      'name',
      'email',
      'role',
      'password',
      'passwordConfirmation',
    ];
    for (const field of requiredFields) {
      if (!request[field]) {
        throw new BadRequest(field);
      }
    }

    await this.createEmployeeUseCase.execute(request);

    return Promise.resolve(null);
  }
}
