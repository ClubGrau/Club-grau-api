import { Controller } from '@nestjs/common';
import { BadRequest } from '../../../employees/presentation/http-exceptions/bad-request';
import { MissingParamError } from '../../../employees/presentation/errors/missing-param.error';
import { SigninUseCase } from '../../application/usecases/signin.usecase';

@Controller('auth')
export class SigninController {
  constructor(private readonly signinUseCase: SigninUseCase) {}

  async handle(request: { email: string; password: string }): Promise<void> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!request[field]) {
        throw new BadRequest(new MissingParamError(field).message);
      }
    }

    await this.signinUseCase.execute(request);

    return Promise.resolve();
  }
}
