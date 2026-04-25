import { randomBytes } from 'crypto';
import UniqueEntityId from './unique-entity-id.vo';
import { InvalidUniqueIdError } from '../../errors/invalid-unique-id.error';

describe('UniqueEntityId unit tests', () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, 'validate');

  it('should throw error when uuid is invalid', () => {
    expect(() => new UniqueEntityId('fake-id')).toThrow(
      new InvalidUniqueIdError(),
    );
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept an id passed in constructor', () => {
    const hexString24bits = randomBytes(12).toString('hex');
    const vo = new UniqueEntityId(hexString24bits);
    expect(vo.getValue()).toBe(hexString24bits);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create an id without an id passed to the constructor', () => {
    const vo = new UniqueEntityId();
    const uuidRegex = /^[0-9a-f]{24}$/;
    expect(uuidRegex.test(vo.getValue())).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});
