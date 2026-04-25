import { EmployeeModel } from '../../../domain/models/employee';

export class GetAllEmployeesResult {
  constructor(
    public readonly employees: EmployeeModel.PrimitivesData[],
    public readonly total: number,
  ) {}
}
