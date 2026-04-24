import { EmployeeModel } from '../../domain/models/employee';

export interface CreateEmployeeRepositoryPort {
  create(
    employee: EmployeeModel.CreateData,
  ): Promise<EmployeeModel.CreateResponseDto>;
}
