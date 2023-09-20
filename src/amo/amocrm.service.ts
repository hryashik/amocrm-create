import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserQueryDto } from 'src/user/dto/userQueryDto';
import { LeadType } from 'src/user/types/leadType';
import { UpdateResponseType } from 'src/user/types/updateResponseType';
import { ContactType, UserResponseType } from 'src/user/types/userResponseType';

@Injectable()
export class AmocrmService {
   constructor(private configService: ConfigService) {}

   // Создание контакта
   async createUser(dto: UserQueryDto) {
      try {
         const token = this.configService.get('ACCESS_TOKEN');
         const { data } = await axios.post<UserResponseType>(
            `https://tsukikohaya.amocrm.ru/api/v4/contacts`,
            [
               {
                  name: dto.name,
                  custom_fields_values: [
                     {
                        field_name: 'Телефон',
                        field_code: 'PHONE',
                        field_type: 'string',
                        values: [
                           {
                              value: dto.phone,
                           },
                        ],
                     },
                     {
                        field_name: 'EMAIL',
                        field_code: 'EMAIL',
                        field_type: 'string',
                        values: [
                           {
                              value: dto.email,
                           },
                        ],
                     },
                  ],
               },
            ],
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'applications/json',
               },
            },
         );
         return data._embedded.contacts[0];
      } catch (error) {
         console.error(error);
         throw new BadRequestException({ error });
      }
   }

   // Найти и вернуть контакт по номеру телефона
   async findUser(phone: string): Promise<ContactType | undefined> {
      try {
         const token = this.configService.get('ACCESS_TOKEN');
         const { data } = await axios.get<UserResponseType>(
            `https://tsukikohaya.amocrm.ru/api/v4/contacts?query=${phone}`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            },
         );
         if (data) {
            return data._embedded.contacts[0];
         } else {
            return undefined;
         }
      } catch (error) {
         console.error(error);
         throw new BadRequestException(error);
      }
   }

   // Обновить данные контакта
   async updateUser(dto: UserQueryDto, id: number): Promise<UpdateResponseType> {
      try {
         const token = this.configService.get('ACCESS_TOKEN');
         const { data } = await axios.patch<UpdateResponseType>(
            `https://tsukikohaya.amocrm.ru/api/v4/contacts/${id}`,
            {
               id,
               name: dto.name,
               custom_fields_values: [
                  {
                     field_id: 2403639,
                     field_name: 'EMAIL',
                     values: [
                        {
                           value: dto.email,
                           enum_id: 4959763,
                        },
                     ],
                  },
               ],
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'applications/json',
               },
            },
         );
         return data
      } catch (error) {
         console.error(error);
         throw new BadRequestException({ error });
      }
   }

   // Создать лид по id контакта
   async createLead(id: number): Promise<LeadType[]> {
      try {
         const token = this.configService.get('ACCESS_TOKEN');
         const { data } = await axios.post(
            `https://tsukikohaya.amocrm.ru/api/v4/leads/complex`,
            [
               {
                  name: 'Сделка ...',
                  price: 10000,
                  _embedded: {
                     contacts: [{ id }],
                  },
               },
            ],
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            },
         );
         return data;
      } catch (error) {
         console.error(error);
         throw new BadRequestException({ error });
      }
   }
}
