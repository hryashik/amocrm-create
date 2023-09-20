import { Injectable } from '@nestjs/common';
import { UserQueryDto } from './dto/userQueryDto';
import { AmocrmService } from 'src/amo/amocrm.service';


@Injectable()
export class UserService {
   constructor(private amocrmService: AmocrmService) {}

   async createUser(dto: UserQueryDto) {
      // Сначала ищу контакт 
      const user = await this.amocrmService.findUser(dto.phone);
      let id: number;

      // Если такой контакт есть, значит сделка на нем висит
      // Просто обновляю его данные, в сделке они изменяться автоматически
      // Если контакта нет - создаю
      if (user) {
         const updateUser = await this.amocrmService.updateUser(dto, user.id);
         return updateUser;
      } else {
         const newUser = await this.amocrmService.createUser(dto);
         id = newUser.id;
      }

      // Создаю сделку
      const data = await this.amocrmService.createLead(id)
      return data
   }
}
