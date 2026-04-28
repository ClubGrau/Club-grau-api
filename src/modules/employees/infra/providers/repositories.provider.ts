import { Provider } from '@nestjs/common';
import { EmployeeMongoRepository } from '../database/repositories/employee-mongo.repository';
import {
  GetAllEmployeesRepositoryPort,
  GetAllEmployeesResponse,
  GetAllOptions,
} from '../../application/ports/get-all-employees.repository.port';

class GetAllEmployeesRepoMock implements GetAllEmployeesRepositoryPort {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAll(options: GetAllOptions): Promise<GetAllEmployeesResponse> {
    return Promise.resolve({
      employees: [],
      total: 0,
    });
  }
}

export const makeRepositoriesProvider = (): Provider[] => [
  {
    provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
    useClass: EmployeeMongoRepository,
  },
  {
    provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT',
    useClass: EmployeeMongoRepository,
  },
  {
    provide: 'GET_ALL_EMPLOYEES_REPOSITORY_PORT',
    useClass: GetAllEmployeesRepoMock,
  },
];
