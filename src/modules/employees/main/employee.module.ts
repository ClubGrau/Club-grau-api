import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { FindActiveEmployeeByEmail } from '../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../domain/models/employee';
import { CheckEmployeeExistenceService } from '../domain/services/check-employee-existence.service';
import { CreateEmployeeRepositoryPort } from '../application/ports/create-employee.repository.port';
import { makeAdaptersProvider } from '../infra/providers/adapters.provider';

// mover metodo para o repositório
class CreateEmployeeRepositoryMock implements CreateEmployeeRepositoryPort {
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    employee: EmployeeModel.CreateData,
  ): Promise<EmployeeModel.CreateResponseDto> {
    return Promise.resolve({ id: 'valid_employee_id' });
  }
}
class FindActiveEmployeeByEmailMock implements FindActiveEmployeeByEmail {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isExist(email: string): Promise<EmployeeModel.Status | null> {
    return Promise.resolve(null);
  }
}

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CheckEmployeeExistenceService,
    ...makeAdaptersProvider(),
    {
      provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
      useClass: FindActiveEmployeeByEmailMock,
    },
    {
      provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT',
      useClass: CreateEmployeeRepositoryMock,
    },
  ],
})
export class EmployeeModule {}
