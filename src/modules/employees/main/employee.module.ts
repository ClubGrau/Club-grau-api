import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { FindActiveEmployeeByEmail } from '../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../domain/models/employee';

// mover metodo para o repositório
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
    {
      provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
      useClass: FindActiveEmployeeByEmailMock,
    },
  ],
})
export class EmployeeModule {}
