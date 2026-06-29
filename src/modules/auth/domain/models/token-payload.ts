import { EmployeeModel } from '../../../employees/domain/models/employee';

export namespace TokenPayloadModel {
  export interface Employee {
    id: string;
    name: string;
    email: string;
    role: EmployeeModel.Role;
  }
}
