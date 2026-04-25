import { EmployeeModel } from '../../domain/models/employee';

export interface FindActiveEmployeeByEmail {
  isExist: (email: string) => Promise<EmployeeModel.Status | null>;
}
