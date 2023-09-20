import { Injectable } from '@nestjs/common';
import { UserQueryDto } from './dto/userQueryDto';
import { AmocrmService } from 'src/amo/amocrm.service';


@Injectable()
export class UserService {
   constructor(private amocrmService: AmocrmService) {}

   async createUser(dto: UserQueryDto) {
      const user = await this.amocrmService.findUser(dto.phone);
      let id: number
      if (user) {
         const updateUser = await this.amocrmService.updateUser(dto, user.id);
         return updateUser;
      } else {
         const newUser = await this.amocrmService.createUser(dto);
         id = newUser.id;
      }
      const data = await this.amocrmService.createLead(id)
      return data
   }
}
