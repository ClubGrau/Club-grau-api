export namespace EmployeeModel {
  export enum Role {
    Admin = 'admin',
    Employee = 'employee',
    Manager = 'manager',
  }

  export interface CreateEmployeeRequestDto {
    name: string;
    email: string;
    role: Role;
    nif?: number | null;
    password: string;
    passwordConfirmation: string;
  }

  export interface EntityCreateInput {
    name: string;
    email: string;
    password: string;
    nif?: number | null;
    role: EmployeeModel.Role;
    isActive?: boolean;
    createdAt?: Date;
    deactivateAt?: Date | null;
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

  export interface Status {
    id: string;
    email: string;
    isActive: boolean;
  }

  export interface CreateEmployeeResponseDto {
    id: string;
  }
}
