import { Provider } from '@nestjs/common';
import { BcryptAdapter } from '../../../shared/infra/cryptograph/adapter/bcrypt/bcrypt.adapter';

export const makeAdaptersProvider = (): Provider[] => [
  {
    provide: 'ENCRYPTER_PORT',
    useClass: BcryptAdapter,
  },
];
