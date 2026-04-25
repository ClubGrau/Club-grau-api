import { Connection } from 'mongoose';
import { Provider } from '@nestjs/common';
import { EmployeeSchema } from '../database/schemas/employee.schema';

export const makeEmployeeModelProvider = (): Provider[] => [
  {
    provide: 'EMPLOYEE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Employee', EmployeeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
