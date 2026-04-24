/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { EncrypterPort } from '../../ports/encrypter.port';

export class BcryptAdapter implements EncrypterPort {
  async hash(value: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
