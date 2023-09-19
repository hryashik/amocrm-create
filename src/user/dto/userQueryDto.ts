import { IsEmail, IsMobilePhone, IsPhoneNumber, IsString, isMobilePhone } from "class-validator";

export class UserQueryDto {
   @IsString()
   name: string

   @IsEmail()
   email: string

   @IsString()
   phone: string
}