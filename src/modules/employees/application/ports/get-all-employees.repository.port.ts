import { EmployeeModel } from '../../domain/models/employee';

export interface GetAllOptions {
  page: number;
  limit: number;
}

export interface GetAllEmployeesResponse {
  employees: Omit<EmployeeModel.PrimitivesData, 'password'>[];
  total: number;
}

export interface GetAllEmployeesRepositoryPort {
  getAll(options: GetAllOptions): Promise<GetAllEmployeesResponse>;
}
