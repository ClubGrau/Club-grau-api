import { Body, Controller, Post } from '@nestjs/common';
import { BadRequest } from '../http-exceptions/bad-request';

interface CreateEmployeeRequestDto {
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'manager';
  password: string;
  passwordConfirmation: string;
}

@Controller('employee')
export class CreateEmployeeController {
  @Post()
  async handle(@Body() request: CreateEmployeeRequestDto) {
    if (!request.name) {
      throw new BadRequest('name');
    }

    if (!request.email) {
      throw new BadRequest('email');
    }

    return Promise.resolve(null);
  }
}
