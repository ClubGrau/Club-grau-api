import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { EmployeeModel } from '../domain/models/employee';
import { CheckEmployeeExistenceService } from '../domain/services/check-employee-existence.service';
import { CreateEmployeeRepositoryPort } from '../application/ports/create-employee.repository.port';
import { makeAdaptersProvider } from '../infra/providers/adapters.provider';
import { makeRepositoriesProvider } from '../infra/providers/repositories.provider';
import { makeEmployeeModelProvider } from '../infra/providers/schema.provider';

// mover metodo para o repositório
class CreateEmployeeRepositoryMock implements CreateEmployeeRepositoryPort {
  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    employee: EmployeeModel.PrimitiviesData,
  ): Promise<EmployeeModel.CreateResponseDto> {
    return Promise.resolve({ id: 'valid_employee_id' });
  }
}

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CheckEmployeeExistenceService,
    ...makeAdaptersProvider(),
    ...makeEmployeeModelProvider(),
    ...makeRepositoriesProvider(),
    {
      provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT',
      useClass: CreateEmployeeRepositoryMock,
    },
  ],
})
export class EmployeeModule {}
