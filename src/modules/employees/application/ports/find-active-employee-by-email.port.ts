import { EmployeeModel } from '../../domain/models/employee';

export interface FindActiveEmployeeByEmailPort {
  isExist: (email: string) => Promise<EmployeeModel.Status | null>;
}
