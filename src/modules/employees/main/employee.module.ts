import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [CreateEmployeeUseCase],
})
export class EmployeeModule {}
