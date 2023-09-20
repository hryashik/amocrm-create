import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ValidationExceptionFilter } from "./filters/validationExceptionFilter";
import { UserService } from "./user.service";
import { AmocrmService } from "src/amo/amocrm.service";

@Module({
   imports: [],
   controllers: [UserController],
   providers: [ValidationExceptionFilter, UserService, AmocrmService]
})
export class UserModule {}