import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from './query';
import type { GetAllEmployeesRepositoryPort } from '../../ports/get-all-employees.repository.port';
import { GetAllEmployeesResult } from './result';

@QueryHandler(GetAllEmployeesQuery)
export class GetAllEmployeesHandler implements IQueryHandler<GetAllEmployeesQuery> {
  constructor(
    @Inject('GET_ALL_EMPLOYEES_REPOSITORY_PORT')
    private readonly getAllEmployeesRepository: GetAllEmployeesRepositoryPort,
  ) {}

  async execute(query: GetAllEmployeesQuery): Promise<GetAllEmployeesResult> {
    const { page, limit } = query;
    const { employees, total } = await this.getAllEmployeesRepository.getAll({
      page,
      limit,
    });
    return new GetAllEmployeesResult(employees, total);
  }
}
