import bcrypt from 'bcrypt';
import { EncrypterPort } from '../../ports/encrypter.port';

export class BcryptAdapter implements EncrypterPort {
  async hash(value: string): Promise<string> {
    const salt = 10;
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async compare(value: string, hashedValue: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
