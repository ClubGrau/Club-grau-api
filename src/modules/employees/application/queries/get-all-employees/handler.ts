import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from './query';
import type { GetAllEmployeesRepositoryPort } from '../../ports/get-all-employees.repository.port';

@QueryHandler(GetAllEmployeesQuery)
export class GetAllEmployeesHandler implements IQueryHandler<GetAllEmployeesQuery> {
  constructor(
    @Inject('GET_ALL_EMPLOYEES_REPOSITORY_PORT')
    private readonly getAllEmployeesRepository: GetAllEmployeesRepositoryPort,
  ) {}

  async execute(query: GetAllEmployeesQuery): Promise<any> {
    const { page = 1, limit = 10 } = query;
    await this.getAllEmployeesRepository.getAll({
      page,
      limit,
    });
    return Promise.resolve(null);
  }
}
