import { Controller, Get, Param, Query, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserQueryDto } from "./dto/userQueryDto";
import { ValidationExceptionFilter } from "./filters/validationExceptionFilter";

@Controller("/user")
@UseFilters(ValidationExceptionFilter)
export class UserController {
   constructor()  {

   }
   @Get()
   @UsePipes(new ValidationPipe())
   createUser(@Query() query: UserQueryDto) {
      return {...query}
   }
}