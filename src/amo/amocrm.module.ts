import { Module } from '@nestjs/common';
import { AmmocrmController } from './amocrm.controller';
import { AmocrmService } from './amocrm.service';

@Module({
   controllers: [AmmocrmController],
   providers: [AmocrmService],
})
export class AmocrmModule {}
