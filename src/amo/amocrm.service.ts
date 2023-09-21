import {
   BadRequestException,
   ForbiddenException,
   Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { isAxiosError } from 'axios';
import { UserQueryDto } from 'src/user/dto/userQueryDto';
import { LeadType } from 'src/user/types/leadType';
import { UpdateResponseType } from 'src/user/types/updateResponseType';
import { ContactType, UserResponseType } from 'src/user/types/userResponseType';
import { InitIntegrationType } from './types/initInegration';
import { GetTokensRequest } from './types/getTokensRequest';
import * as path from 'path';
import * as fs from 'node:fs';
import { readConfig } from './utils/readConfig';
import { RefreshTokenDto } from 'src/user/types/refreshTokenDto';

@Injectable()
export class AmocrmService {
   constructor(private configService: ConfigService) {}

   // Создание контакта
   async createUser(dto: UserQueryDto) {
      try {
         const token = (await readConfig()).access_token;
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
         const token = (await readConfig()).access_token;
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
         if (isAxiosError(error)) {
            if (error.response.data.status === 401) {
               await this.refreshToken()
               throw new ForbiddenException('Need to refresh token');
            }
         }
         console.error(error);
         throw new BadRequestException(error.response);
      }
   }

   // Обновить данные контакта
   async updateUser(
      dto: UserQueryDto,
      id: number,
   ): Promise<UpdateResponseType> {
      try {
         const token = (await readConfig()).access_token;
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
         return data;
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

   async getTokens(dto: InitIntegrationType) {
      try {
         // достаю данные и формирую объект
         const api_key = this.configService.get('API_KEY');
         const redirect_uri = this.configService.get('REDIRECT_URI');
         const obj: GetTokensRequest = {
            client_id: dto.client_id,
            client_secret: api_key,
            code: dto.code,
            grant_type: 'authorization_code',
            redirect_uri,
         };

         // делаю запрос на получение токенов
         const { data } = await axios.post<{
            access_token: string;
            refresh_token: string;
         }>(`https://${dto.referer}/oauth2/access_token`, obj);

         // формирую конфиг и сохраняю его
         const config = {
            ...dto,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
         };
         const fileName = path.join(process.cwd(), 'config', 'config.json');
         if (!fs.existsSync('./config')) {
            await fs.promises.mkdir('config');
         }
         await fs.promises.writeFile(fileName, JSON.stringify(config));
      } catch (error) {
         console.log(error);
      }
   }
   async refreshToken() {
      try {
         const api_key = this.configService.get('API_KEY');
         const config = await readConfig();
         const dataObj: RefreshTokenDto = {
            client_id: config.client_id,
            client_secret: api_key,
            grant_type: 'refresh_token',
            redirect_uri: 'https://4cd0-46-72-73-90.ngrok-free.app/amo',
            refresh_token: config.refresh_token,
         };
         const { data } = await axios.post<{
            access_token: string;
            refresh_token: string;
         }>(`https://tsukikohaya.amocrm.ru/oauth2/access_token`, dataObj);
         config.access_token = data.access_token;
         config.refresh_token = data.refresh_token;
         await fs.promises.writeFile(
            './config/config.json',
            JSON.stringify(config),
         );
      } catch (error) {
         throw new Error('Не удалось получить новый токен');
      }
   }
}
