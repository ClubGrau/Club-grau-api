import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { BadRequest } from '../../../employees/presentation/http-exceptions/bad-request';
import { MissingParamError } from '../../../employees/presentation/errors/missing-param.error';
import { SigninUseCase } from '../../application/usecases/signin.usecase';
import { ServerError } from '../../../shared/errors/http-expections/server.error';

@Controller('auth')
export class SigninController {
  constructor(private readonly signinUseCase: SigninUseCase) {}

  @Post('signin')
  async handle(
    @Body() request: { email: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const requiredFields = ['email', 'password'];
      for (const field of requiredFields) {
        if (!request[field]) {
          throw new BadRequest(new MissingParamError(field).message);
        }
      }

      const { email, password } = request;
      const { token } = await this.signinUseCase.execute({ email, password });
      return { token };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new ServerError();
    }
  }
}
