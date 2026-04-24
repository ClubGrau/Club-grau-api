import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmployeeUseCase } from './create-employee.usecase';
import { EmployeeModel } from '../../domain/models/employee';
import { CheckEmployeeExistenceService } from '../../domain/services/check-employee-existence.service';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';
import { ExistEmployeeError } from '../../domain/errors/exist-employee.error';
import { InactiveEmployeeError } from '../../domain/errors/inactive-employee.error';
import { InvalidParamNameLengthError } from '../../domain/errors/invalid-param-name-length.error';
import { EncrypterPort } from '../../infra/cryptograph/ports/encrypter.port';
import { CreateEmployeeRepositoryPort } from '../ports/create-employee.repository.port';

const makeSub = () => ({
  checkEmployeeExistenceService: {
    check: jest.fn() as jest.Mock<Promise<Error | null>, [string]>,
  },
  encrypterStub: {
    hash: jest.fn().mockResolvedValue('hashedPassword') as jest.MockedFunction<
      EncrypterPort['hash']
    >,
  } satisfies EncrypterPort,
  createEmplyeeRepositoryStub: {
    create: jest
      .fn()
      .mockResolvedValue({ id: 'valid_employee_id' }) as jest.MockedFunction<
      CreateEmployeeRepositoryPort['create']
    >,
  } satisfies CreateEmployeeRepositoryPort,
});

const makeSut = async () => {
  const {
    checkEmployeeExistenceService,
    encrypterStub,
    createEmplyeeRepositoryStub,
  } = makeSub();

  const testModule: TestingModule = await Test.createTestingModule({
    providers: [
      CreateEmployeeUseCase,
      {
        provide: CheckEmployeeExistenceService,
        useValue: checkEmployeeExistenceService,
      },
      {
        provide: 'ENCRYPTER_PORT',
        useValue: encrypterStub,
      },
      {
        provide: 'CREATE_EMPLOYEE_REPOSITORY_PORT',
        useValue: createEmplyeeRepositoryStub,
      },
    ],
  }).compile();

  const sut = testModule.get<CreateEmployeeUseCase>(CreateEmployeeUseCase);

  return {
    sut,
    checkEmployeeExistenceService,
    encrypterStub,
    createEmplyeeRepositoryStub,
  };
};

describe('CreateEmployeeUseCase', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeUseCase);
  });

  it('should have an execute method', async () => {
    const { sut } = await makeSut();
    expect(sut.execute.bind(sut)).toBeDefined();
    expect(typeof sut.execute).toBe('function');
  });

  it('should return an error if password and passwordConfirmation do not match', async () => {
    const { sut } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    };

    const execute = sut.execute(params);
    await expect(execute).rejects.toBeInstanceOf(PasswordNotMatchError);
    await expect(execute).rejects.toThrow(
      'Password and passwordConfirmation do not match',
    );
  });

  it('should return an error if employee already exists and is active', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(new ExistEmployeeError());
    const execute = sut.execute(params);
    await expect(execute).rejects.toBeInstanceOf(ExistEmployeeError);
    await expect(execute).rejects.toThrow('Employee already exists');
  });

  it('should return an error if existent employee is inactive', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(new InactiveEmployeeError());
    const execute = sut.execute(params);
    await expect(execute).rejects.toBeInstanceOf(InactiveEmployeeError);
    await expect(execute).rejects.toThrow('Existent employee is inactive');
  });

  it('should return null if employee does not exist', async () => {
    const { sut, checkEmployeeExistenceService } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(checkEmployeeExistenceService, 'check')
      .mockResolvedValueOnce(null);
    const execute = sut.execute(params);
    await expect(execute).resolves.toEqual({ id: 'valid_id' });
  });

  it('should return a domain error if Employee.create() fails', async () => {
    const { sut } = await makeSut();
    const params = {
      name: 'Jo', // inválido: Name exige entre 3 e 255 caracteres
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const execute = sut.execute(params);
    await expect(execute).rejects.toBeInstanceOf(InvalidParamNameLengthError);
    await expect(execute).rejects.toThrow(
      'Invalid param format: name cannot be shorter than 3 characters or longer than 255 characters',
    );
  });

  it('should call encrypter with correct values', async () => {
    const { sut, encrypterStub } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const encrypterSpy = jest.spyOn(encrypterStub, 'hash');
    await sut.execute(params);
    expect(encrypterSpy).toHaveBeenCalledWith('P@ssword123');
  });

  it('should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(encrypterStub, 'hash')
      .mockRejectedValueOnce(new Error('Encryption error'));
    await expect(sut.execute(params)).rejects.toThrow('Encryption error');
  });

  it('should calls saveEmployeeRepository with correct values', async () => {
    const { sut, createEmplyeeRepositoryStub } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const saveSpy = jest
      .spyOn(createEmplyeeRepositoryStub, 'create')
      .mockResolvedValueOnce({
        id: 'valid_employee_id',
      });
    const result = await sut.execute(params);
    expect(result).not.toBeInstanceOf(Error);
    expect(saveSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(String),
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      password: 'hashedPassword',
      nif: null,
      isActive: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      createdAt: expect.any(Date),
      deactivateAt: null,
    });
  });

  it('should throw if createEmployeeRepository throws', async () => {
    const { sut, createEmplyeeRepositoryStub } = await makeSut();
    const params = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin' as EmployeeModel.Role,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    jest
      .spyOn(createEmplyeeRepositoryStub, 'create')
      .mockRejectedValueOnce(new Error('Repository error'));
    await expect(sut.execute(params)).rejects.toThrow('Repository error');
  });
});
