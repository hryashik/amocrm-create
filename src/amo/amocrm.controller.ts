import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { InitIntegrationType } from './types/initInegration';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { AmocrmService } from './amocrm.service';

@Controller('/amo')
export class AmmocrmController {
   constructor(private amoService: AmocrmService) {}
   @Get()
   async getReqIntergration(@Query() query: InitIntegrationType) {
      return await this.amoService.getTokens(query);
   }
}
