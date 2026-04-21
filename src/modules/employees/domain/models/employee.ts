export namespace EmployeeModel {
  export type Role = 'admin' | 'employee' | 'manager';

  export interface CreateEmployeeRequestDto {
    name: string;
    email: string;
    role: Role;
    password: string;
    passwordConfirmation: string;
  }

  export interface CreatedEmployeeOutput {
    id: string;
    name: string;
    email: string;
    role: EmployeeModel.Role;
    password: string;
    isActive: boolean;
    nif: number;
    createdAt: string;
    deactivatedAt: string | null;
  }

  export interface CreateEmployeeResponseDto {
    id: string;
  }
}
