import { TokenPayloadModel } from '../../../domain/models/token-payload';

export interface EmployeeTokenPayload extends TokenPayloadModel.Employee {
  sub: string;
  iat?: number;
  exp?: number;
}
