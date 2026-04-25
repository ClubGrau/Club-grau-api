import { InvalidNifFormatError } from '../../errors/invalid-nif-format.error';
import { ValueObject } from '../value-object';

export default class Nif extends ValueObject<number> {
  private constructor(nif: number) {
    super(nif);
  }

  static create(nif: number): Nif | Error {
    const error = Nif.validate(nif);
    if (error) {
      return error;
    }
    return new Nif(nif);
  }

  static validate(nif: number): InvalidNifFormatError | null {
    const nifString = nif.toString();
    if (nifString.length < 9 || nifString.length > 9) {
      return new InvalidNifFormatError();
    }

    return null;
  }
}
