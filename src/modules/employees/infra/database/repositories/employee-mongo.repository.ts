import { Injectable } from '@nestjs/common';
import { FindActiveEmployeeByEmail } from '../../../application/ports/find-active-employee-by-email.port';
import { EmployeeModel } from '../../../domain/models/employee';

@Injectable()
export class EmployeeMongoRepository implements FindActiveEmployeeByEmail {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isExist(email: string): Promise<EmployeeModel.Status | null> {
    return Promise.resolve(null);
  }
}
