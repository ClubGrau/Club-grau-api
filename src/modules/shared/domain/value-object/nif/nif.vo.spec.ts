import { InvalidNifFormatError } from '../../errors/invalid-nif-format.error';
import Nif from './nif.vo';

const makeSut = () => {
  const sut = Nif;
  return sut;
};

describe('NIF Value Object', () => {
  it('should not create a NIF if it is greater than 9 digits', () => {
    const sut = makeSut();
    const nif = 1234567890;
    const error = new InvalidNifFormatError();
    const nifOrError = sut.create(nif);
    expect(nifOrError).toEqual(error);
  });

  it('should not create a NIF if it is shorter than 9 digits', () => {
    const sut = makeSut();
    const nif = 12345678;
    const error = new InvalidNifFormatError();
    const nifOrError = sut.create(nif);
    expect(nifOrError).toEqual(error);
  });

  it('should validate return an error for a NIF shorter than 9 digits', () => {
    const sut = makeSut();
    const nif = 12345678;
    const nifOrError = sut.validate(nif);
    expect(nifOrError).toBeInstanceOf(InvalidNifFormatError);
  });

  it('should validate return an error for a NIF greater than 9 digits', () => {
    const sut = makeSut();
    const nif = 1234567890;
    const nifOrError = sut.validate(nif);
    expect(nifOrError).toBeInstanceOf(InvalidNifFormatError);
  });

  it('should validate return null for a valid NIF', () => {
    const sut = makeSut();
    const nif = 123456789;
    const nifOrError = sut.validate(nif);
    expect(nifOrError).toBe(null);
  });

  it('should create a NIF with valid value', () => {
    const sut = makeSut();
    const nif = 123456789;
    const nifOrError = sut.create(nif);
    expect(typeof nifOrError).toBe('object');
    expect((nifOrError as Nif).getValue()).toBe(nif);
  });
});
