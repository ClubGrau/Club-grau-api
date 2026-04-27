import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from '../../application/queries/get-all-employees/query';
import { GetAllEmployeesResult } from '../../application/queries/get-all-employees/result';

@Controller('employees')
export class GetAllEmployeesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async handle(@Query('page') page = '1', @Query('limit') limit = '10') {
    await this.queryBus.execute<GetAllEmployeesQuery, GetAllEmployeesResult>(
      new GetAllEmployeesQuery(Number(page), Number(limit)),
    );
  }
}
