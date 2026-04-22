import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import type { EmployeeModel } from '../../domain/models/employee';
import { MissingParamError } from '../errors/missing-param.error';
import { BadRequest } from '../http-exceptions/bad-request';
import { ServerError } from '../http-exceptions/server-error';

@Controller('employee')
export class CreateEmployeeController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  async handle(
    @Body() request: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    try {
      const requiredFields = [
        'name',
        'email',
        'role',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!request[field]) {
          throw new BadRequest(new MissingParamError(field).message);
        }
      }

      const response = await this.createEmployeeUseCase.execute(request);

      return { id: response.id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new ServerError();
    }
  }
}
