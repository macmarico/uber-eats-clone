import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {DomainModule} from './app/domain/domain.module';
import {TerminusModule} from '@nestjs/terminus';
import {AppService} from './app.service';
@Module({
  imports: [DomainModule, TerminusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
