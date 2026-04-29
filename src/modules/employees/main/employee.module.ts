import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { CheckEmployeeExistenceService } from '../domain/services/check-employee-existence.service';
import { makeAdaptersProvider } from '../infra/providers/adapters.provider';
import { makeRepositoriesProvider } from '../infra/providers/repositories.provider';
import { makeEmployeeModelProvider } from '../infra/providers/schema.provider';
import { GetAllEmployeesController } from '../presentation/controllers/get-all-employees.controller';
import { GetAllEmployeesHandler } from '../application/queries/get-all-employees/handler';

@Module({
  imports: [CqrsModule],
  controllers: [GetAllEmployeesController, CreateEmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CheckEmployeeExistenceService,
    GetAllEmployeesHandler,
    ...makeAdaptersProvider(),
    ...makeEmployeeModelProvider(),
    ...makeRepositoriesProvider(),
  ],
})
export class EmployeeModule {}
