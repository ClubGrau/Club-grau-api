import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllEmployeesQuery } from './query';

@QueryHandler(GetAllEmployeesQuery)
export class GetAllEmployeesHandler implements IQueryHandler<GetAllEmployeesQuery> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetAllEmployeesQuery): Promise<any> {
    return Promise.resolve(null);
  }
}
