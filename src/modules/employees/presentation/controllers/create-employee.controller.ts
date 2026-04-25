import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { BadRequest } from '../http-exceptions/bad-request';
import { CreateEmployeeUseCase } from '../../application/usecases/create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';
import { MissingParamError } from '../errors/missing-param.error';
import { ServerError } from '../http-exceptions/server-error';
import { domainErrorStatusMap } from '../http-exceptions/http-error.mapper';

@Controller('employee')
export class CreateEmployeeController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  async handle(
    @Body() request: EmployeeModel.CreateRequestDto,
  ): Promise<EmployeeModel.CreateResponseDto> {
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

      return await this.createEmployeeUseCase.execute(request);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);

      const status = domainErrorStatusMap.get(
        (error as Error).constructor as new (...args: any[]) => Error,
      );

      if (status) {
        throw new HttpException((error as Error).message, status);
      }
      throw new ServerError();
    }
  }
}
