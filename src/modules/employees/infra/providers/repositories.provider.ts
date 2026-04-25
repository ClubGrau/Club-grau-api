import { Provider } from '@nestjs/common';
import { EmployeeMongoRepository } from '../database/repositories/employee-mongo.repository';

export const makeRepositoriesProvider = (): Provider[] => [
  {
    provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
    useClass: EmployeeMongoRepository,
  },
  {
    provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT',
    useClass: EmployeeMongoRepository,
  },
];
