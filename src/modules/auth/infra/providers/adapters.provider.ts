import { Provider } from '@nestjs/common';
import { JwtAdapter } from '../jwt/jwt-adapter';
import { BcryptAdapter } from '../../../shared/infra/cryptograph/adapter/bcrypt/bcrypt.adapter';

export const makeAdaptersProvider = (): Provider[] => [
  {
    provide: 'GENERATE_TOKEN_PORT',
    useClass: JwtAdapter,
  },
  {
    provide: 'COMPARE_PORT',
    useClass: BcryptAdapter,
  },
];
