import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AmocrmModule } from './amo/amocrm.module';

@Module({
  imports: [UserModule, AmocrmModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
