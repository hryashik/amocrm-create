import {
   BadRequestException,
   ForbiddenException,
   HttpException,
   HttpStatus,
   Injectable,
   Response,
} from '@nestjs/common';
import { UserQueryDto } from './dto/userQueryDto';
import { AmocrmService } from 'src/amo/amocrm.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
   constructor(
      private amocrmService: AmocrmService,
      private configService: ConfigService,
   ) {}

   async createUser(dto: UserQueryDto) {
      const user = await this.amocrmService.findUser(dto.phone);
      if (user) {
         const updateUser = await this.amocrmService.updateUser(dto, user.id);
         return updateUser
      } else {
         const newUser = await this.amocrmService.createUser(dto);
         return newUser;
      }
   }
   async findUser(phone: string) {
      const data = await this.amocrmService.findUser(phone);
      return data;
   }
}
