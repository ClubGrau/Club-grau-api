import { Controller } from '@nestjs/common';
import { BadRequest } from '../../../employees/presentation/http-exceptions/bad-request';
import { MissingParamError } from '../../../employees/presentation/errors/missing-param.error';

@Controller('auth')
export class SigninController {
  async handle(request: { email: string; password: string }): Promise<void> {
    if (!request.email) {
      throw new BadRequest(new MissingParamError('email').message);
    }

    return Promise.resolve();
  }
}
