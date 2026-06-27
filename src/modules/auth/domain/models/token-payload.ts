import { EmployeeModel } from '../../../employees/domain/models/employee';

export namespace TokenPayloadModel {
  export interface Employee {
    id: string;
    email: string;
    role: EmployeeModel.Role;
  }
}
