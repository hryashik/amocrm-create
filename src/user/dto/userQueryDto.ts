import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UserQueryDto {
   @IsString()
   @MinLength(3)
   name: string

   @IsEmail()
   email: string

   @IsString()
   @MinLength(10)
   @MaxLength(12)
   phone: string
}