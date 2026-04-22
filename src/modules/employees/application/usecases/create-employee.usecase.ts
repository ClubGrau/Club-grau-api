import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../../domain/models/employee';
import { CheckEmployeeExistenceService } from '../../domain/services/check-employee-existence.service';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly checkEmployeeExistence: CheckEmployeeExistenceService,
  ) {}

  async execute(
    params: EmployeeModel.CreateEmployeeRequestDto,
  ): Promise<EmployeeModel.CreateEmployeeResponseDto> {
    const { password, passwordConfirmation } = params;
    if (password !== passwordConfirmation) {
      throw new Error('Password and passwordConfirmation do not match');
    }

    const isExistOrInactive = await this.checkEmployeeExistence.check(
      params.email,
    );
    if (isExistOrInactive instanceof Error) {
      throw isExistOrInactive;
    }

    return Promise.resolve({
      id: 'valid_id',
    });
  }
}
