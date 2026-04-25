import { EmployeeModel } from '../../domain/models/employee';

export interface CreateEmployeeRepositoryPort {
  create(
    employee: EmployeeModel.PrimitivesData,
  ): Promise<EmployeeModel.CreateResponseDto>;
}
