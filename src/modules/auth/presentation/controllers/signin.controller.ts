import { Controller } from '@nestjs/common';

@Controller('auth')
export class SigninController {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(request: { email: string; password: string }): Promise<void> {}
}
