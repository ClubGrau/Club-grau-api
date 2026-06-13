import { Injectable } from '@nestjs/common';

@Injectable()
export class SigninUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(params: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    return Promise.resolve({ token: 'valid_token' });
  }
}
