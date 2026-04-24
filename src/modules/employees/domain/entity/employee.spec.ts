import { InvalidEmailFormatError } from '../../../shared/domain/errors/invalid-email-format.error';
import { InvalidNifFormatError } from '../../../shared/domain/errors/invalid-nif-format.error';
import { InvalidPasswordFormatError } from '../../../shared/domain/errors/invalid-password-format.error';
import { InvalidParamFormatError } from '../errors/invalid-param-format.error';
import { InvalidParamNameLengthError } from '../errors/invalid-param-name-length.error';
import { Employee, EmployeeCreateInput } from './Employee';

const makeSut = () => {
  const employeeProps: EmployeeCreateInput = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'P@ssword',
    nif: 123456789,
  };
  const sut = Employee;

  return {
    sut,
    employeeProps,
  };
};

describe('Employee Entity', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(Function);
  });

  it('should create an employee with an auto incremented id', () => {
    const { sut, employeeProps } = makeSut();
    const employeeOrError = sut.create(employeeProps);
    expect(employeeOrError).toBeInstanceOf(Employee);
    expect((employeeOrError as Employee).id).toBeDefined();
  });

  describe('Employee name validation', () => {
    it('should return error if name is only whitespace', () => {
      const { sut, employeeProps } = makeSut();
      const employeeOrError = sut.create({ ...employeeProps, name: '   ' });
      expect(employeeOrError).toBeInstanceOf(InvalidParamFormatError);
    });

    it('should return error if name is shorter than 3 characters', () => {
      const { sut, employeeProps } = makeSut();
      const employeeOrError = sut.create({ ...employeeProps, name: 'Jo' });
      expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    });

    it('should return error if name is longer than 255 characters', () => {
      const { sut, employeeProps } = makeSut();
      const longName = 'J'.repeat(256);
      const employeeOrError = sut.create({ ...employeeProps, name: longName });
      expect(employeeOrError).toBeInstanceOf(InvalidParamNameLengthError);
    });

    it('should create an employee if name is valid', () => {
      const { sut, employeeProps } = makeSut();
      const name = 'John Doe';
      const employeeOrError = sut.create({ ...employeeProps, name });
      expect(employeeOrError).toBeInstanceOf(Employee);
    });
  });

  describe('Emplyee email validation', () => {
    it('should return error if email starts with a dot (.)', () => {
      const { sut, employeeProps } = makeSut();
      const email = '.john.doe@example.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: email must not start with a dot (.)',
      );
    });

    it('should return error if email is without @ sign', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'john.doeexample.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: email must contain an "@" symbol',
      );
    });

    it('should return error if email has more than 256 characters', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'a'.repeat(247) + '@example.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: email must not exceed 256 characters',
      );
    });

    it('should return error if the account part (before @) is longer than 64 characters', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'a'.repeat(65) + '@example.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: account part must not exceed 64 characters',
      );
    });

    it('should return error if any domain part (between dots) is longer than 63 characters', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'john.doe@' + 'a'.repeat(64) + '.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: domain part must not exceed 63 characters',
      );
    });

    it('should return error if email contains invalid characters', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'a@b.c';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(InvalidEmailFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid email format: email contains invalid characters',
      );
    });

    it('should create an employee if email is valid', () => {
      const { sut, employeeProps } = makeSut();
      const email = 'john.doe@example.com';
      const employeeOrError = sut.create({ ...employeeProps, email });
      expect(employeeOrError).toBeInstanceOf(Employee);
    });
  });

  describe('Employee password validation', () => {
    it('should create an employee if password is valid', () => {
      const { sut, employeeProps } = makeSut();
      const password = 'P@ssword';
      const employeeOrError = sut.create({ ...employeeProps, password });
      expect(employeeOrError).toBeInstanceOf(Employee);
    });

    it('should return error if password is only whitespace', () => {
      const { sut, employeeProps } = makeSut();
      const password = '   ';
      const employeeOrError = sut.create({ ...employeeProps, password });
      expect(employeeOrError).toBeInstanceOf(InvalidPasswordFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: password cannot be only whitespace',
      );
    });

    it('should return error if password is shorter than 6 characters', () => {
      const { sut, employeeProps } = makeSut();
      const password = 'P@s';
      const employeeOrError = sut.create({ ...employeeProps, password });
      expect(employeeOrError).toBeInstanceOf(InvalidPasswordFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: password cannot be shorter than 6 characters',
      );
    });

    it('should return error if password does not have one uppercase letter at least', () => {
      const { sut, employeeProps } = makeSut();
      const password = 'p@ssword';
      const employeeOrError = sut.create({ ...employeeProps, password });
      expect(employeeOrError).toBeInstanceOf(InvalidPasswordFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: password must have at least one uppercase letter',
      );
    });

    it('should return error if password does not have a special character at least', () => {
      const { sut, employeeProps } = makeSut();
      const password = 'Password';
      const employeeOrError = sut.create({ ...employeeProps, password });
      expect(employeeOrError).toBeInstanceOf(InvalidPasswordFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: password must have at least one special character',
      );
    });
  });

  describe('Employee nif validation', () => {
    it('should create an employee if nif is valid', () => {
      const { sut, employeeProps } = makeSut();
      const nif = 123456789;
      const employeeOrError = sut.create({ ...employeeProps, nif });
      expect(employeeOrError).toBeInstanceOf(Employee);
    });

    it('should return error if nif is shorter than 9 digits', () => {
      const { sut, employeeProps } = makeSut();
      const nif = 12345678;
      const employeeOrError = sut.create({ ...employeeProps, nif });
      expect(employeeOrError).toBeInstanceOf(InvalidNifFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: nif must be a 9-digit number',
      );
    });

    it('should return error if nif is greater than 9 digits', () => {
      const { sut, employeeProps } = makeSut();
      const nif = 1234567890;
      const employeeOrError = sut.create({ ...employeeProps, nif });
      expect(employeeOrError).toBeInstanceOf(InvalidNifFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: nif must be a 9-digit number',
      );
    });

    it('should return error if nif is not numeric', () => {
      const { sut, employeeProps } = makeSut();
      const nif = 'nif' as unknown as number;
      const employeeOrError = sut.create({ ...employeeProps, nif });
      expect(employeeOrError).toBeInstanceOf(InvalidNifFormatError);
      expect((employeeOrError as Error).message).toBe(
        'Invalid param format: nif must be a 9-digit number',
      );
    });
  });
});
