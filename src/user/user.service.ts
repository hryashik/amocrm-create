import { Injectable } from '@nestjs/common';
import { UserQueryDto } from './dto/userQueryDto';
import { AmocrmService } from 'src/amo/amocrm.service';
import { ContactType } from './types/userResponseType';

@Injectable()
export class UserService {
   constructor(private amocrmService: AmocrmService) {}

   async createUser(dto: UserQueryDto) {
      const user = await this.amocrmService.findUser(dto.phone);
      let lead: ContactType;
      if (user) {
         const updateUser = await this.amocrmService.updateUser(dto, user.id);
         lead = updateUser;
      } else {
         const newUser = await this.amocrmService.createUser(dto);
         lead = newUser;
      }
      const data = await this.amocrmService.createLead(lead)
      return data;
   }
}
