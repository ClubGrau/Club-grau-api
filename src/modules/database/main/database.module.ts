import { Global, Module } from '@nestjs/common';
import { makeDatabaseProvider } from '../providers/database.provider';

const providers = [...makeDatabaseProvider()];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class DatabaseModule {}
