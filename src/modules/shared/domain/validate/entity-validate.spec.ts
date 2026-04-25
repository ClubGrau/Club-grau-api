import { validate } from './entity-validate';

describe('validate helper', () => {
  it('should return all values if none are errors', () => {
    const result = validate(1, 'ok', null, undefined, true);
    expect(result).toEqual([1, 'ok', null, undefined, true]);
  });

  it('should return the first error if any value is an error', () => {
    const error = new Error('fail');
    const result = validate(1, error, 'ok');
    expect(result).toBe(error);
  });

  it('should return the first error even if there are multiple errors', () => {
    const error1 = new Error('fail1');
    const error2 = new Error('fail2');
    const result = validate(error1, error2, 123);
    expect(result).toBe(error1);
  });

  it('should work with empty input', () => {
    const result = validate();
    expect(result).toEqual([]);
  });

  it('should work with only one value', () => {
    const result = validate('single');
    expect(result).toEqual(['single']);
  });

  it('should work with only one error', () => {
    const error = new Error('fail');
    const result = validate(error);
    expect(result).toBe(error);
  });
});
