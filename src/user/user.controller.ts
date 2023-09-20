import {
   Controller,
   Get,
   Param,
   Query,
   UseFilters,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { UserQueryDto } from './dto/userQueryDto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
   constructor(private userService: UserService) {}
   
   @Get()
   @UsePipes(new ValidationPipe())
   getUser(@Query() query: UserQueryDto) {
      return this.userService.createUser(query);
   }
}
