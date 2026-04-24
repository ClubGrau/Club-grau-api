import { Module } from '@nestjs/common';
import { CreateEmployeeController } from '../presentation/controllers/create-employee.controller';
import { CreateEmployeeUseCase } from '../application/usecases/create-employee.usecase';
import { FindActiveEmployeeByEmail } from '../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../domain/models/employee';
import { CheckEmployeeExistenceService } from '../domain/services/check-employee-existence.service';
import { EncrypterPort } from '../infra/cryptograph/ports/encrypter.port';

// mover metodo para o repositório
class FindActiveEmployeeByEmailMock implements FindActiveEmployeeByEmail {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isExist(email: string): Promise<EmployeeModel.Status | null> {
    return Promise.resolve(null);
  }
}

class EncrypterMock implements EncrypterPort {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async hash(value: string): Promise<string> {
    return Promise.resolve('hashedValue');
  }
}

@Module({
  imports: [],
  controllers: [CreateEmployeeController],
  providers: [
    CreateEmployeeUseCase,
    CheckEmployeeExistenceService,
    {
      provide: 'FIND_ACTIVE_EMPLOYEE_BY_EMAIL',
      useClass: FindActiveEmployeeByEmailMock,
    },
    {
      provide: 'ENCRYPTER_PORT',
      useClass: EncrypterMock,
    },
  ],
})
export class EmployeeModule {}
