import { Module } from '@nestjs/common';
import { SigninController } from '../presentation/controllers/signin.controller';
import { SigninUseCase } from '../application/usecases/signin.usecase';

@Module({
  imports: [],
  controllers: [SigninController],
  providers: [SigninUseCase],
})
export class AuthModule {}
