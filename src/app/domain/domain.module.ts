import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {CoreModule} from './core/core.module';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
