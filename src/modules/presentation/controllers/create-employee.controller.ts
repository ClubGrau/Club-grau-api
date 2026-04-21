import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { BadRequest } from '../http-exceptions/bad-request';

interface CreateEmployeeResponseDto {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  password: string;
  isActive: boolean;
  nif: number;
  createdAt: string;
  deactivatedAt: string | null;
}
@Injectable()
export class CreateEmployeeUseCase {
  async execute(
    request: CreateEmployeeRequestDto,
  ): Promise<CreateEmployeeResponseDto> {
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
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

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

    await this.createEmployeeUseCase.execute(request);

    return Promise.resolve(null);
  }
}
