import { EmployeeModel } from '../../../domain/models/employee';

export class GetAllEmployeesResult {
  constructor(
    public readonly employees: Omit<EmployeeModel.PrimitivesData, 'password'>[],
    public readonly total: number,
  ) {}
}
