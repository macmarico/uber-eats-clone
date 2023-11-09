import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DomainModule} from './app/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
