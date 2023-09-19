import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ValidationExceptionFilter } from "./filters/validationExceptionFilter";

@Module({
   imports: [],
   controllers: [UserController],
   providers: [ValidationExceptionFilter]
})
export class UserModule {}