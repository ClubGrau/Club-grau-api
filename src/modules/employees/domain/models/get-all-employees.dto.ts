import { EmployeeModel } from './employee';

export class EmployeeResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly nif: number | null,
    public readonly role: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly deactivateAt: Date | null,
  ) {}

  static fromDomain = (
    employee: Omit<EmployeeModel.PrimitivesData, 'password'>,
  ): EmployeeResponseDto => {
    return new EmployeeResponseDto(
      employee.id,
      employee.name,
      employee.email,
      employee.nif ?? null,
      employee.role,
      employee.isActive,
      employee.createdAt,
      employee.deactivateAt ?? null,
    );
  };
}
