import { Module } from '@nestjs/common';
import {
  CreateEmployeeController,
  CreateEmployeeUseCase,
} from '../presentation/controllers/create-employee.controller';

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [CreateEmployeeUseCase],
})
export class EmployeeModule {}
