import { Body, Controller, Post } from '@nestjs/common';
import { BadRequest } from '../http-exceptions/bad-request';

export type EmployeeRole = 'admin' | 'employee' | 'manager';
interface CreateEmployeeRequestDto {
  name: string;
  email: string;
  role: EmployeeRole;
  password: string;
  passwordConfirmation: string;
}

@Controller('employee')
export class CreateEmployeeController {
  @Post()
  async handle(@Body() request: CreateEmployeeRequestDto) {
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

    return Promise.resolve(null);
  }
}
