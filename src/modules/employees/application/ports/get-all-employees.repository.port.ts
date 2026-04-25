import { EmployeeModel } from '../../domain/models/employee';

export interface GetAllOptions {
  page: number;
  limit: number;
}

export interface GetAllEmployeesRepositoryPort {
  getAll(
    options: GetAllOptions,
  ): Promise<{ employees: EmployeeModel.PrimitivesData[]; total: number }>;
}
