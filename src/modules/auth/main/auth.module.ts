import { Module } from '@nestjs/common';
import { SigninController } from '../presentation/controllers/signin.controller';
import { SigninUseCase } from '../application/usecases/signin.usecase';
import { makeAdaptersProvider } from '../infra/providers/adapters.provider';
import { EmployeeModule } from '../../employees/main/employee.module';

@Module({
  imports: [EmployeeModule],
  controllers: [SigninController],
  providers: [SigninUseCase, ...makeAdaptersProvider()],
})
export class AuthModule {}
