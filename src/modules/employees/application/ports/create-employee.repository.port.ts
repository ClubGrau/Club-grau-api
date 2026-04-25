import { EmployeeModel } from '../../domain/models/employee';

export interface CreateEmployeeRepositoryPort {
  create(
    employee: EmployeeModel.PrimitiviesData,
  ): Promise<EmployeeModel.CreateResponseDto>;
}
