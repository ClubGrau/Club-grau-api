import { HttpStatus } from '@nestjs/common';
import { PasswordNotMatchError } from '../../domain/errors/password-not-match.error';
import { ExistEmployeeError } from '../../domain/errors/exist-employee.error';
import { InactiveEmployeeError } from '../../domain/errors/inactive-employee.error';
import { InvalidNameFormatError } from '../../../shared/domain/errors/invalid-name-format.error';
import { InvalidEmailFormatError } from '../../../shared/domain/errors/invalid-email-format.error';
import { InvalidPasswordFormatError } from '../../../shared/domain/errors/invalid-password-format.error';
import { InvalidNifFormatError } from '../../../shared/domain/errors/invalid-nif-format.error';

export const domainErrorStatusMap = new Map<
  new (...args: any[]) => Error,
  HttpStatus
>([
  [InvalidNameFormatError, HttpStatus.BAD_REQUEST],
  [InvalidEmailFormatError, HttpStatus.BAD_REQUEST],
  [InvalidPasswordFormatError, HttpStatus.BAD_REQUEST],
  [InvalidNifFormatError, HttpStatus.BAD_REQUEST],
  [PasswordNotMatchError, HttpStatus.BAD_REQUEST],
  [ExistEmployeeError, HttpStatus.CONFLICT],
  [InactiveEmployeeError, HttpStatus.CONFLICT],
]);
