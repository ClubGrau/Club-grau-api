import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { CheckEmployeeExistenceService } from '../domain/services/check-employee-existence.service';
import { makeAdaptersProvider } from '../infra/providers/adapters.provider';
import { makeRepositoriesProvider } from '../infra/providers/repositories.provider';
import { makeEmployeeModelProvider } from '../infra/providers/schema.provider';

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CheckEmployeeExistenceService,
    ...makeAdaptersProvider(),
    ...makeEmployeeModelProvider(),
    ...makeRepositoriesProvider(),
  ],
})
export class EmployeeModule {}
