import {Module} from '@nestjs/common';
import {DBModule} from '../../storage/database/db.module';
import {ConfigModule} from '../../config/config.module';
import {UserEntity} from './user/entity/user.entity';
import {TerminusModule} from '@nestjs/terminus';
import {UserModule} from './user/user.module';
import {AppLoggerModule} from '../../logger/logger.module';

@Module({
  imports: [
    DBModule.forRoot({
      entities: [UserEntity],
    }),
    UserModule,
    ConfigModule,
    AppLoggerModule,
    TerminusModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
