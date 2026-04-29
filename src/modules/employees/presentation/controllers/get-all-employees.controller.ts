import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from '../../application/queries/get-all-employees/query';
import { GetAllEmployeesResult } from '../../application/queries/get-all-employees/result';
import { EmployeeResponseDto } from '../../domain/models/get-all-employees.dto';

@Controller('employees')
export class GetAllEmployeesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle(@Query('page') page = '1', @Query('limit') limit = '10') {
    const result = await this.queryBus.execute<
      GetAllEmployeesQuery,
      GetAllEmployeesResult
    >(new GetAllEmployeesQuery(Number(page), Number(limit)));

    return {
      data: result.employees.map(EmployeeResponseDto.fromDomain),
      total: result.total,
    };
  }
}
