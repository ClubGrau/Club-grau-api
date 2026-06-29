import jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeeTokenPayload } from './types/jwt.types';
import { GenerateTokenPort } from '../../application/ports/generate-token.port';
import { TokenPayloadModel } from '../../domain/models/token-payload';
import { SigninModel } from '../../domain/models/signin';

@Injectable()
export class JwtAdapter implements GenerateTokenPort<TokenPayloadModel.Employee> {
  private readonly secret: string;

  constructor(
    @Inject('CONFIG_SERVICE') private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.getOrThrow<string>('JWT_SECRET');
  }

  generate(payload: TokenPayloadModel.Employee): SigninModel.ResponseDto {
    const entityId = payload.id;
    const tokenPayload: EmployeeTokenPayload = {
      sub: entityId,
      id: entityId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    const token = jwt.sign(tokenPayload, this.secret, {
      expiresIn: '30h',
    });
    return { token };
  }
}
